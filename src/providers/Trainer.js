import {query} from '../services/db.js';

/**
 * Get trainer rate distribution
 * @param {Number} id
 * @param {Number} gamesId
 * @return {Promise<Array<any>>}
 */
function getRateDistribution(id, gamesId) {
  if (gamesId === null) {
    return query(`SELECT
          COALESCE(value, 0) AS n,
          COUNT(value)::int AS count
        FROM reviews
        LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
        WHERE trainer_id = $1 AND value IS NOT NULL
        GROUP BY n`, id);
  }
  return query(`SELECT
        COALESCE(value, 0) AS n,
        COUNT(value)::int AS count
      FROM reviews
      LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
      WHERE trainer_id = $1 AND value IS NOT NULL AND reviews.game_id = $2
      GROUP BY n`, id, gamesId);
}

/**
 * Get trainer rate vote
 * @param {Number} id
 * @param {Number} gamesId
 * @return {Promise<Array<any>>}
 */
function getRateVote(id, gamesId) {
  if (gamesId === null) {
    return query(`SELECT
          AVG(value) AS value,
          question
        FROM
        review_votes
        JOIN votes ON votes.vote_id = review_votes.vote_id
        JOIN reviews ON reviews.review_id = review_votes.review_id
        WHERE reviews.trainer_id = $1
        GROUP BY question`, id);
  }
  return query(`SELECT
        AVG(value) AS value,
        question
      FROM
      review_votes
      JOIN votes ON votes.vote_id = review_votes.vote_id
      JOIN reviews ON reviews.review_id = review_votes.review_id
      WHERE reviews.trainer_id = $1 AND reviews.game_id = $2
      GROUP BY question`, id, gamesId);
}

/**
 * Get trainer reviews
 * @param {number} id
 * @return {Promise<Array<any>>} reviews
 */
export function getTrainerReviews(id) {
  return query(`SELECT *
      FROM
        (SELECT
          trainer_id,
          user_id AS id,
          title,
          text,
          date,
          COALESCE(AVG(value), 0) AS rate
        FROM reviews
        LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
        GROUP BY reviews.review_id
        )
      AS reviews
      WHERE trainer_id = $1`, id);
}

/**
 * Get trainer rate data
 * @param {number} id
 * @param {number} gamesId
 * @return {Promise<any>} rate data
 */
export async function getTrainerRateData(id, gamesId) {
  const [distribution, vote] = await Promise.all([getRateDistribution(id, gamesId), getRateVote(id, gamesId)]);
  const distributionCount = distribution.reduce((acc, d) => acc + d.count, 0);
  return {
    distribution: distribution.map(({n, count}) => ({n, value: (count / distributionCount) * 100})),
    vote: vote.map(({question, value}) => ({question, value: Math.round(value)})),
  };
}
