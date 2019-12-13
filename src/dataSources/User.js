import {query} from '../services/db.js';

/**
 * User data source
 */
export class User {
  /**
   * Get user games
   * @param {number} id
   * @return {Promise<Array<any>>} user games
   */
  games(id) {
    return query(`SELECT games.game_id AS id, name, shortname, description, tags, site FROM games
                JOIN user_games ON user_games.game_id = games.game_id AND user_id = $1`, id);
  }

  /**
   * Get user by id
   * @param {number} id
   * @return {Promise<any>} user
   */
  async getById(id) {
    const [data] = await query(`SELECT
      0 AS trains,
      0 AS students,
      users.user_id AS id,
      pic,
      name,
      rank,
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
        HAVING trainer_id = $1
      ), 0) AS rate,
      streamer
      FROM
      users
      LEFT JOIN
      (SELECT
        trainers.user_id,
        MAX(rank) AS rank,
        BOOL_OR(COALESCE(streamers.user_id, 0) > 0) AS streamer
        FROM trainers
        LEFT JOIN streamers ON
          trainers.user_id = streamers.user_id
          AND streamers.game_id = trainers.game_id
        GROUP BY trainers.user_id
      ) AS trainers ON trainers.user_id = users.user_id
      WHERE
      users.user_id = $1`, id);
    return data;
  }

  /**
   * Get user reviews
   * @param {number} id
   * @return {Promise<Array<any>>} reviews
   */
  reviews(id) {
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

  /**
   * Get user by email hash
   * @param {String} emailHash
   * @return {Promise<{id: Number}>} user
   */
  async getByEmail(emailHash) {
    const [data] = await query('SELECT user_id AS id from users WHERE email = $1', emailHash);
    return data;
  }

  /**
   * Add user
   * @param {String} emailHash
   * @param {String} name
   * @param {String} pic
   */
  async addUser(emailHash, name, pic) {
    const [data] = await query(`INSERT INTO users(email, name, pic)
          VALUES($1, $2, $3) RETURNING user_id AS id`, emailHash, name, pic);
    return data;
  }
}
