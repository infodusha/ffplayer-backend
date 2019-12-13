import {createWriteStream, promises as fs} from 'fs';
import uuid from 'uuid/v4.js';
import {query} from '../services/db.js';
import config from '../../config.json';
import {ApolloError} from '../services/error.js';
import {Coder} from '../services/coder.js';
import {hash} from '../services/auth.js';
import {send} from '../services/mail.js';

const {lifetime, attempts} = config.auth.code;
const codes = new Coder(lifetime, attempts);

/**
 * Update pic
 * @param {Number} id
 * @param {Promise<any>} file
 * @return {Promise<String>} newPic
 */
async function updateSelfPic(id, file) {
  const {stream: readStream, mimetype} = await file;
  if (!config.data.picMimeTypes.includes(mimetype)) {
    throw new ApolloError('Pic mime type not valid');
  }
  const newPic = uuid();
  const writeStream = createWriteStream(`images/${newPic}`, {flags: 'w'});
  readStream.pipe(writeStream);
  await new Promise((resolve, reject) => {
    writeStream.on('error', reject);
    writeStream.on('close', resolve);
  });
  const [{pic: oldPic}] = await query('SELECT pic FROM users WHERE user_id = $1', id);
  await query('UPDATE users SET pic = $2 WHERE user_id = $1', id, newPic);
  await fs.unlink(`images/${oldPic}`);
}

/**
 * Update self
 * @param {Number} id
 * @param {Promise<any>} pic
 * @param {String} name
 * @return {Promise<true>} updated data
 */
export async function updateSelf(id, pic, name) {
  if (name !== null) {
    await query(`UPDATE users SET name = $2 WHERE user_id = $1`, id, name);
  }
  if (pic !== null) {
    await updateSelfPic(id, pic);
  }
  return true;
}

/**
 * Post email code
 * @param {Number} id
 * @param {String} oldEmail
 * @param {String} newEmail
 * @return {Promise<true>}
 */
export async function postEmailCode(id, oldEmail, newEmail) {
  const oldEmailHash = hash(oldEmail);
  const [{email}] = await query(`SELECT email FROM users WHERE user_id = $1`, id);
  if (email !== oldEmailHash) {
    throw new ApolloError('Old email is not correct');
  }
  const newEmailHash = hash(newEmail);
  if (codes.has(oldEmailHash) ||codes.has(newEmailHash)) {
    throw new ApolloError('Mails already got codes');
  }
  const [oldCode, newCode] = await Promise.all([codes.add(oldEmailHash), codes.add(newEmailHash)]);
  await Promise.all([
    send({
      from: 'no-reply@ffplayer.pro',
      to: oldEmail,
      subject: 'Code for email change: ' + oldCode,
      text: 'Code for email change: ' + oldCode,
    }),
    send({
      from: 'no-reply@ffplayer.pro',
      to: newEmail,
      subject: 'Code for email change: ' + newCode,
      text: 'Code for email change: ' + newCode,
    }),
  ]);
  return true;
}

/**
 * Change email
 * @param {Number} id
 * @param {String} oldEmail
 * @param {String} newEmail
 * @param {String} oldCode
 * @param {String} newCode
 * @return {Promise<true>}
 */
export async function updateEmail(id, oldEmail, newEmail, oldCode, newCode) {
  const oldEmailHash = hash(oldEmail);
  const [{email}] = await query(`SELECT email FROM users WHERE user_id = $1`, id);
  if (email !== oldEmailHash) {
    throw new ApolloError('Old email is not correct');
  }
  const newEmailHash = hash(newEmail);
  if (!codes.has(oldEmailHash) || !codes.has(newEmailHash)) {
    throw new ApolloError('Codes expired');
  }
  if (!codes.hasAttempts(oldEmailHash) || !codes.hasAttempts(newEmailHash)) {
    throw new ApolloError('Codes reached maximum attempts');
  }
  const oldCorrect = codes.check(oldEmailHash, oldCode);
  if (!oldCorrect) {
    throw new ApolloError('Old code not correct');
  }
  const newCorrect = codes.check(newEmailHash, newCode);
  if (!newCorrect) {
    throw new ApolloError('New code not correct');
  }
  await query(`UPDATE users SET email = $2 WHERE user_id = $1`, id, newEmailHash);
  return true;
}
