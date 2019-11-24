import https from 'https';
import fs from 'fs';
import Stream from 'stream';
import crypto from 'crypto';
import config from '../../config.json';
import uuid from 'uuid/v4.js';

/**
 * Get image from url
 * @param {string} url
 * @return {Promise<Blob>} image
 */
function getImageByUrl(url) {
  return new Promise((resolve, reject) => {
    https.request(url, (response) => {
      const data = new Stream.Transform();

      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('end', () => {
        resolve(data.read());
      });
    }).end();
  });
}

/**
 * Save random pic
 * @param {String} email
 * @return {Promise<String>} pic
 */
export async function saveRandomPic(email) {
  const params = new URLSearchParams(config.gavatar.params);
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  const data = await getImageByUrl(`${config.gavatar.url}${hash}?${params.toString()}`);
  const pic = uuid();
  await fs.promises.writeFile(`images/${pic}`, data);
  return pic;
}
