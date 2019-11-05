import {query} from '../services/db.js';
import fs from 'fs';
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
  if (file === null) {
    return null;
  }
  const {stream: readStream, mimetype} = await file;
  if (!config.data.picMimeTypes.includes(mimetype)) {
    throw new ApolloError('Pic mime type not valid');
  }
  const newPic = uuid();
  const writeStream = fs.createWriteStream(`images/${newPic}`, {flags: 'w'});
  readStream.pipe(writeStream);
  await new Promise((resolve, reject) => {
    writeStream.on('error', reject);
    writeStream.on('close', resolve);
  });
  const [{pic: oldPic}] = await query('SELECT pic FROM users WHERE id = $1', id);
  await query('UPDATE users SET pic = $2 WHERE id = $1', id, newPic);
  await fs.promises.unlink(`images/${oldPic}`);
  return newPic;
}

/**
 * Update self data
 * @param {Number} id
 * @param {String} name
 * @param {String} email
 */
async function updateSelfData(id, name, email) {
  if (name !== null || email !== null) {
    await query('UPDATE users SET name = COALESCE($2, name), email = COALESCE($3, email) WHERE id = $1', id, name, email);
  }
  return {name, email};
}

/**
 * Update self
 * @param {Number} id
 * @param {Promise<any>} pic
 * @param {String} name
 * @param {String} email
 * @return {Promise<any>} updated data
 */
export async function updateSelf(id, pic, name, email) {
  const [newPic, {name: newName, email: newEmail}] = await Promise.all([updateSelfPic(id, pic), updateSelfData(id, name, email)]);
  return {pic: newPic, name: newName, email: newEmail};
}
