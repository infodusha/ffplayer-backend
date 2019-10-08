import {query} from '../services/db.js';

/**
 * Get news part
 * @param {Number} cursor
 * @param {Number} length
 * @return {Promise<Array<any>>} news
 */
export function getNews(cursor, length) {
  return query('SELECT * FROM news WHERE id > $1 LIMIT $2', cursor, length);
}
