import {query} from '../services/db.js';

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Boolean} streamer
 * @param {Number} game
 * @param {Number} cursor
 * @param {Number} length
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game, cursor, length) {
  if (game === null) {
    return query(`SELECT trainers.id, users.name, users.pic, trainers.rank, trainers.rate, trainers.streamer
                FROM trainers
                JOIN users ON users.id = trainers.users_id
                WHERE
                trainers.id > $1
                AND rank = coalesce($2, rank)
                AND streamer = coalesce($3::boolean, streamer)
                LIMIT $4`, cursor, rank, streamer, length);
  }
  return query(`SELECT trainers.id, users.name, users.pic, trainers.rank, trainers.rate, trainers.streamer
                FROM trainers
                JOIN users ON users.id = trainers.users_id
                JOIN user_games ON user_games.users_id = trainers.users_id
                WHERE
                trainers.id > $1
                AND rank = coalesce($2, rank)
                AND streamer = coalesce($3::boolean, streamer)
                AND user_games.games_id = $4
                AND user_games.trains = true
                LIMIT $5`, cursor, rank, streamer, game, length);
}
