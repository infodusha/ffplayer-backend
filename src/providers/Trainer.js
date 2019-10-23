import {query} from '../services/db.js';

/**
 * Get trainer reviews
 * @param {number} id
 * @return {Promise<Array<any>>} reviews
 */
export function getTrainerReviews(id) {
  return query('SELECT users_id AS id, rate, title, text, date FROM reviews WHERE trainers_id = $1', id);
}
