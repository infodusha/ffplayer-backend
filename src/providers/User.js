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
          trainer_id AS id,
          user_id,
          title,
          text,
          date,
          COALESCE(AVG(value), 0) AS rate
        FROM reviews
        LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
        GROUP BY reviews.review_id
        )
      AS reviews
      WHERE user_id = $1`, id);
}
