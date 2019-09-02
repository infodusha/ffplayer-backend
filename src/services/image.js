import Image from '../models/Image.js';
import util from 'util';

const findById = util.promisify(Image.findById).bind(Image);

/**
 * Get image by id
 * @param {string} id
 * @return {any} image
 */
export async function getImageById(id) {
  const {img} = await findById(id);
  return img;
}
