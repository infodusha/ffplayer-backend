import {query} from '../services/db.js';

/**
 * Get trainer reviews
 * @param {number} id
 * @return {Promise<Array<any>>} reviews
 */
export function getTrainerReviews(id) {
  return query(`SELECT *
      FROM
        (SELECT
          trainers_id,
          users_id AS id,
          title,
          text,
          date,
          COALESCE(AVG(value), 0) AS rate
        FROM reviews
        LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
        GROUP BY reviews.id
        )
      AS reviews
      WHERE trainers_id = $1`, id);
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
