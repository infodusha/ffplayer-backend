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
        LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
        WHERE trainers_id = $1
        GROUP BY n`, id);
  }
  return query(`SELECT
        COALESCE(value, 0) AS n,
        COUNT(value)::int AS count
      FROM reviews
      LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
      WHERE trainers_id = $1 AND reviews.games_id = $2
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
        reviews_votes
        JOIN votes ON votes.id = reviews_votes.votes_id
        JOIN reviews ON reviews.id=  reviews_votes.reviews_id
        WHERE reviews.trainers_id = $1
        GROUP BY question`, id);
  }
  return query(`SELECT
        AVG(value) AS value,
        question
      FROM
      reviews_votes
      JOIN votes ON votes.id = reviews_votes.votes_id
      JOIN reviews ON reviews.id=  reviews_votes.reviews_id
      WHERE reviews.trainers_id = $1 AND reviews.games_id = $2
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
  return Promise.all([
    getRateDistribution(id, gamesId),
    getRateVote(id, gamesId),
  ]).then(([distribution, vote]) => {
    const distributionCount = distribution.reduce((acc, d) => acc + d.count, 0);
    return {
      distribution: distribution
          .map(({n, count}) => ({n, value: (count / distributionCount) * 100})),
      vote: vote
          .map(({question, value}) => ({question, value: Math.round(value)})),
    };
  });
}
