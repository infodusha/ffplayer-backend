import faker from 'faker';
import https from 'https';
import Stream from 'stream';

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
 * Get image by id
 * @param {string} id
 * @return {any} image
 */
export function getImageById(id) {
  const url = faker.internet.avatar();
  return getImageByUrl(url);
}
