import {query} from '../services/db.js';

/**
 * News data source
 */
export class News {
  /**
   * Get news
   * @param {number} offset
   * @param {number} length
   * @return {Promise<Array<any>>} news
   */
  list(offset, length) {
    return query('SELECT news_id AS id, title, text, date FROM news ORDER BY date DESC OFFSET $1 LIMIT $2', offset, length);
  }
}
