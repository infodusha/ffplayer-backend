import {query} from '../services/db.js';
import {createWriteStream, promises as fs} from 'fs';
import uuid from 'uuid/v4.js';
import config from '../../config.json';
import {ApolloError} from '../services/error.js';

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
  const [{pic: oldPic}] = await query('SELECT pic FROM users WHERE id = $1', id);
  await query('UPDATE users SET pic = $2 WHERE id = $1', id, newPic);
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
    await query(`UPDATE users SET name = $2 WHERE id = $1`, id, name);
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
  // TODO
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
  // TODO
  return true;
}
