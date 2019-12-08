import {query} from '../services/db.js';

/**
 * Get game by shortname
 * @param {string} shortname
 * @return {Promise<any>} game
 */
export async function getGame(shortname) {
  const [game] = await query(`SELECT game_id AS id, name, shortname, description, tags, site
        FROM games WHERE shortname = $1`, shortname);
  return game;
}

/**
 * Get news
 * @param {number} offset
 * @param {number} length
 * @return {Promise<Array<any>>} news
 */
export function getNews(offset, length) {
  return query('SELECT news_id AS id, title, text, date FROM news ORDER BY date DESC OFFSET $1 LIMIT $2', offset, length);
}

/**
 * Get games
 * @return {Promise<Array<any>>} games
 */
export function getGames() {
  return query('SELECT game_id AS id, name, shortname, description, tags, site FROM games ORDER BY id');
}

/**
 * Get filtered trainers
 * @param {String} rank
 * @param {Boolean} streamer
 * @param {Number} game
 * @param {Number} offset
 * @param {Number} length
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game, offset, length) {
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
