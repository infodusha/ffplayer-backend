import {query} from '../services/db.js';

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Number} streamer
 * @param {Number} game
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game) {
  return query('SELECT * FROM trainers LIMIT 20');
}
