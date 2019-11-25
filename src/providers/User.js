import {query} from '../services/db.js';

/**
 * Get user reviews
 * @param {number} id
 * @return {Promise<Array<any>>} reviews
 */
export function getUserReviews(id) {
  return query(`SELECT *
      FROM
        (SELECT
          trainers_id AS id,
          users_id,
          title,
          text,
          date,
          COALESCE(AVG(value), 0) AS rate
        FROM reviews
        LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
        GROUP BY reviews.id
        )
      AS reviews
      WHERE users_id = $1`, id);
}
