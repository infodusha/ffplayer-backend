import {query} from '../services/db.js';

/**
 * Get trainer reviews
 * @param {number} id
 * @return {Promise<Array<any>>} reviews
 */
export function getTrainerReviews(id) {
  return query(`SELECT
        users_id AS id,
        (SELECT COALESCE(AVG(rate), 0) FROM reviews WHERE trainers_id = $1) AS rate,
        title,
        text,
        date
      FROM
        reviews
      WHERE
        trainers_id = $1`, id);
}

/**
 * Get trainer rate data
 * @param {number} id
 * @param {number} gamesId
 * @return {Promise<any>} rate data
 */
export function getTrainerRateData(id, gamesId) {
  if (gamesId === null) {
    return {}; // TODO
  }
  return {}; // TODO
}
