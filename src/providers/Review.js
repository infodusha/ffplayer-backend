import {query} from '../services/db.js';

/**
 * Get user by id
 * @param {number} id
 * @return {Promise<any>} user
 */
export function getUser(id) {
  return query('SELECT id, pic, name FROM users WHERE id = $1', id);
}
