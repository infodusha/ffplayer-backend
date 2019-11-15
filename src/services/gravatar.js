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

      response.on('data', function(chunk) {
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
  const params = Object.keys(config.gavatar.params)
      .map((key) => `${key}=${encodeURIComponent(config.gavatar.params[key])}`)
      .join('&');
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  const data = await getImageByUrl(`${config.gavatar.url}${hash}?${params}`);
  const pic = uuid();
  await fs.promises.writeFile(`images/${pic}`, data);
  return pic;
}
