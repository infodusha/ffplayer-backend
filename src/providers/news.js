import {query} from '../services/db.js';

/**
 * Get news part
 * @param {Number} first
 * @param {Number} length
 * @return {Promise<Array<any>>} news
 */
export function getNews(first, length) {
  return query('SELECT * FROM news LIMIT $1 OFFSET $2', length, first);
}
