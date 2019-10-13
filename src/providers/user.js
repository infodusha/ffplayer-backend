import {query} from '../services/db.js';

/**
 * Get user data by id
 * @param {number} id
 * @return {Promise<any>} user data
 */
export async function getUserById(id) {
  const [data] = await query('SELECT id, pic, name FROM users WHERE id = $1', id);
  return data;
}
