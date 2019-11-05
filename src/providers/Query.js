import {query} from '../services/db.js';

/**
 * Get game by shortname
 * @param {string} shortname
 * @return {Promise<any>} game
 */
export async function getGame(shortname) {
  const [game] = await query(`SELECT id, name, shortname, description, tags, site
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
  return query('SELECT id, title, text, date FROM news ORDER BY date DESC OFFSET $1 LIMIT $2', offset, length);
}

/**
 * Get games
 * @return {Promise<Array<any>>} games
 */
export function getGames() {
  return query('SELECT id, name, shortname, description, tags, site FROM games ORDER BY id');
}

/**
 * Get user by id
 * @param {number} id
 * @return {Promise<any>} user
 */
export async function getUser(id) {
  const [data] = await query(`SELECT
      id,
      pic,
      name,
      rank,
      COALESCE((SELECT
        AVG(rate)
        FROM
        (SELECT
          trainers_id,
          COALESCE(AVG(value), 0) AS rate
          FROM reviews
          LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
          GROUP BY reviews.id
        ) AS reviews
        GROUP BY trainers_id
        HAVING trainers_id = $1
      ), 0) AS rate,
      streamer
      FROM
      users
      LEFT JOIN
      (SELECT
        trainers.users_id,
        MAX(rank) AS rank,
        BOOL_OR(COALESCE(streamers.users_id, 0) > 0) AS streamer
        FROM trainers
        LEFT JOIN streamers ON
          trainers.users_id = streamers.users_id
          AND streamers.games_id = trainers.games_id
        GROUP BY trainers.users_id
      ) AS trainers ON trainers.users_id = id
      WHERE
      id = $1`, id);
  return data;
}

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Boolean} streamer
 * @param {Number} game
 * @param {Number} offset
 * @param {Number} length
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game, offset, length) {
  if (game === null) {
    return query(`SELECT
          id,
          name,
          pic,
          COALESCE((SELECT
            AVG(rate)
            FROM
            (SELECT
              trainers_id,
              COALESCE(AVG(value), 0) AS rate
              FROM reviews
              LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
              GROUP BY reviews.id
            ) AS reviews
            GROUP BY trainers_id
            HAVING trainers_id = id
          ), 0) AS rate,
          rank,
          streamer
        FROM (
          SELECT
            id,
            name,
            pic,
            MAX(rank) AS rank,
            BOOL_OR(COALESCE(streamers.users_id, 0) > 0) AS streamer
          FROM trainers
            JOIN users ON
              users.id = trainers.users_id
            LEFT JOIN streamers ON
              users.id = streamers.users_id
              AND streamers.games_id = trainers.games_id
          GROUP BY users.id, users.name, users.pic
        ) AS trainers
        WHERE
          rank = COALESCE($1, rank)
          AND streamer = COALESCE($2::boolean, streamer)
        ORDER BY rate DESC
        OFFSET $3
        LIMIT $4`, rank, streamer, offset, length);
  }
  return query(`SELECT
        id,
        games_id,
        name,
        pic,
        COALESCE((SELECT
          AVG(rate)
          FROM
          (SELECT
            trainers_id,
            COALESCE(AVG(value), 0) AS rate
            FROM reviews
            LEFT JOIN reviews_votes ON reviews_votes.reviews_id = reviews.id
            GROUP BY reviews.id
          ) AS reviews
          GROUP BY trainers_id
          HAVING trainers_id = id
          AND games_id = $5
        ), 0) AS rate,
        rank,
        streamer
      FROM (
        SELECT
          id,
          trainers.games_id,
          name,
          pic,
          rank,
          COALESCE(streamers.users_id, 0) > 0 AS streamer
        FROM trainers
        JOIN users ON
          users.id = trainers.users_id
          AND trainers.games_id = $5
        LEFT JOIN streamers ON
          users.id = streamers.users_id
          AND streamers.games_id = $5
      ) AS trainers
      WHERE
        rank = COALESCE($1, rank)
        AND streamer = COALESCE($2::boolean, streamer)
      ORDER BY rate DESC
      OFFSET $3
      LIMIT $4`, rank, streamer, offset, length, game);
}
