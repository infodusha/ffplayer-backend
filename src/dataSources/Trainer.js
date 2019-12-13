import {query} from '../services/db.js';

/**
 * Trainer data source
 */
export class Trainer {
  /**
   * Get filtered trainers
   * @param {String} rank
   * @param {Boolean} streamer
   * @param {Number} game
   * @param {Number} offset
   * @param {Number} length
   * @return {Promise<Array<any>>} trainers
   */
  list(rank, streamer, game, offset, length) {
    if (game === null) {
      return query(`SELECT
            0 AS trains,
            0 AS students,
            id,
            name,
            pic,
            COALESCE((SELECT
              AVG(rate)
              FROM
              (SELECT
                trainer_id,
                COALESCE(AVG(value), 0) AS rate
                FROM reviews
                LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
                GROUP BY reviews.review_id
              ) AS reviews
              GROUP BY trainer_id
              HAVING trainer_id = id
            ), 0) AS rate,
            rank,
            streamer
          FROM (
            SELECT
              users.user_id AS id,
              name,
              pic,
              MAX(rank) AS rank,
              BOOL_OR(COALESCE(streamers.user_id, 0) > 0) AS streamer
            FROM trainers
              JOIN users ON
                users.user_id = trainers.user_id
              LEFT JOIN streamers ON
                users.user_id = streamers.user_id
                AND streamers.game_id = trainers.game_id
            GROUP BY users.user_id, users.name, users.pic
          ) AS trainers
          WHERE
            rank = COALESCE($1, rank)
            AND streamer = COALESCE($2::boolean, streamer)
          ORDER BY rate DESC
          OFFSET $3
          LIMIT $4`, rank, streamer, offset, length);
    }
    return query(`SELECT
          0 AS trains,
          0 AS students,
          id,
          name,
          pic,
          COALESCE((SELECT
            AVG(rate)
            FROM
            (SELECT
              trainer_id,
              COALESCE(AVG(value), 0) AS rate
              FROM reviews
              LEFT JOIN review_votes ON review_votes.review_id = reviews.review_id
              GROUP BY reviews.review_id
            ) AS reviews
            GROUP BY trainer_id
            HAVING trainer_id = id
            AND game_id = $5
          ), 0) AS rate,
          rank,
          streamer
        FROM (
          SELECT
            users.user_id AS id,
            trainers.game_id,
            name,
            pic,
            rank,
            COALESCE(streamers.user_id, 0) > 0 AS streamer
          FROM trainers
          JOIN users ON
            users.user_id = trainers.user_id
            AND trainers.game_id = $5
          LEFT JOIN streamers ON
            users.user_id = streamers.user_id
            AND streamers.game_id = $5
        ) AS trainers
        WHERE
          rank = COALESCE($1, rank)
          AND streamer = COALESCE($2::boolean, streamer)
        ORDER BY rate DESC
        OFFSET $3
        LIMIT $4`, rank, streamer, offset, length, game);
  }
  /**
   * Get trainer rate distribution
   * @param {Number} id
   * @param {Number} gamesId
   * @return {Promise<Array<any>>}
   */
  rateDistribution(id, gamesId) {
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
  rateVote(id, gamesId) {
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
  reviews(id) {
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
  async rateData(id, gamesId) {
    const [distribution, vote] = await Promise.all([
      this.rateDistribution(id, gamesId),
      this.rateVote(id, gamesId),
    ]);
    const distributionCount = distribution.reduce((acc, d) => acc + d.count, 0);
    return {
      distribution: distribution.map(({n, count}) => ({n, value: (count / distributionCount) * 100})),
      vote: vote.map(({question, value}) => ({question, value: Math.round(value)})),
    };
  }
}
