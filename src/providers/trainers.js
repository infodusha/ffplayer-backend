import {query} from '../services/db.js';

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Number} streamer
 * @param {Number} game
 * @param {Number} first
 * @param {Number} length
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game, first, length) {
  if (game === null) {
    return query(`SELECT trainers.id, users.name, users.pic, trainers.rank, trainers.rate, trainers.streamer
                FROM trainers
                JOIN users ON users.id = trainers.users_id
                WHERE rank = coalesce($1, rank)
                AND streamer = coalesce($2::boolean, streamer)
                LIMIT $3 OFFSET $4`, rank, streamer, length, first);
  }
  return query(`SELECT trainers.id, users.name, users.pic, trainers.rank, trainers.rate, trainers.streamer
                FROM trainers
                JOIN users ON users.id = trainers.users_id
                JOIN user_games ON user_games.users_id = trainers.users_id
                WHERE rank = coalesce($1, rank)
                AND streamer = coalesce($2::boolean, streamer)
                AND game = $3
                LIMIT $4 OFFSET $5`, rank, streamer, game, length, first);
}
