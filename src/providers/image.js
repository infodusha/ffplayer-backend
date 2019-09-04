import {query} from '../services/db.js';

/**
 * Get image by id
 * @param {string} id
 * @return {any} image
 */
export async function getImageById(id) {
  return query('SELECT type, data FROM images WHERE id = $1', id);
}
