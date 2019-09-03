import Trainer from '../models/Trainer.js';
import util from 'util';

/**
 * Get filtered trainers
 * @param {Number} rank
 * @param {Number} streamer
 * @param {Number} game
 * @return {Promise<Array<any>>} trainers
 */
export function getTrainers(rank, streamer, game) {
  const filter = {
    game,
  };
  return util.promisify(Trainer.find).call(News, filter, null, {limit: 20});
}
