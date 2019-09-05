import {query} from '../services/db.js';

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Number} streamer
 * @param {Number} game
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game) {
  return query(`SELECT trainers.id, users.name, users.pic, trainers.rank, trainers.rate, trainers.streamer
                FROM trainers
                JOIN users ON users.id = trainers.users_id
                WHERE rank = coalesce($1, rank)
                AND streamer = coalesce($2::boolean, streamer)
                LIMIT 20`, rank, streamer);
}
