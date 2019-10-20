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
    return query(`SELECT
        users.id,
        name,
        pic,
        MAX(rank) AS rank,
        AVG(rate) as rate,
        BOOL_OR(coalesce(streamers.users_id::bool, false)) AS streamer
        FROM trainers
        JOIN users ON users.id = trainers.users_id
        LEFT JOIN streamers ON users.id = streamers.users_id AND streamers.games_id = trainers.games_id
        GROUP BY users.id, users.name, users.pic
        HAVING
        MAX(rank) = coalesce($1, MAX(rank))
        AND BOOL_OR(coalesce(streamers.users_id::bool, false)) = 
          coalesce($2::boolean, BOOL_OR(coalesce(streamers.users_id::bool, false)))
        ORDER BY AVG(rate) DESC
        OFFSET $3
        LIMIT $4`, rank, streamer, offset, length);
  }
  return query(`SELECT
      users.id,
      name,
      pic,
      rank,
      rate,
      coalesce(streamers.users_id::bool, false) AS streamer
      FROM trainers
      JOIN users ON users.id = trainers.users_id AND trainers.games_id = $5
      LEFT JOIN streamers ON users.id = streamers.users_id AND streamers.games_id = $5
      WHERE
      rank = coalesce($1, rank)
      AND coalesce(streamers.users_id::bool, false) = coalesce($2::boolean, coalesce(streamers.users_id::bool, false))
      ORDER BY rate DESC
      OFFSET $3
      LIMIT $4`, rank, streamer, offset, length, game);
}
