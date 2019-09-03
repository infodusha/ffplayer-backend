import News from '../models/News.js';
import util from 'util';

/**
 * Get news part
 * @param {Number} first
 * @param {Number} length
 * @return {Promise<Array<any>>} news
 */
export function getNews(first, length) {
  return util.promisify(News.find).call(News, {}, null, {skip: first, limit: length});
}
