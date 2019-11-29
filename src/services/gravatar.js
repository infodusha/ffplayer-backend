import https from 'https';
import {promises as fs} from 'fs';
import {Transform} from 'stream';
import {createHash} from 'crypto';
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
      const data = new Transform();

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
  const hash = createHash('md5').update(email.toLowerCase()).digest('hex');
  const data = await getImageByUrl(`${config.gavatar.url}${hash}?${params}`);
  const pic = uuid();
  await fs.writeFile(`images/${pic}`, data);
  return pic;
}
