import {query} from '../services/db.js';

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
    return query(`SELECT * FROM (
          SELECT
            users.id,
            name,
            pic,
            MAX(rank) AS rank,
            AVG(rate) as rate,
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
  return query(`SELECT * FROM (
        SELECT
          users.id,
          name,
          pic,
          rank,
          rate,
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
