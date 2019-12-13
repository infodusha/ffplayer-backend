import {query} from '../services/db.js';

/**
 * Game data source
 */
export class Game {
  /**
   * Get game by shortname
   * @param {string} shortname
   * @return {Promise<any>} game
   */
  async getByShortname(shortname) {
    const [game] = await query(`SELECT game_id AS id, name, shortname, description, tags, site
          FROM games WHERE shortname = $1`, shortname);
    return game;
  }

  /**
   * Get games
   * @return {Promise<Array<any>>} games
   */
  list() {
    return query('SELECT game_id AS id, name, shortname, description, tags, site FROM games ORDER BY id');
  }

  /**
   * Get game skills
   * @param {number} id
   * @return {Promise<Array<any>>} skills
   */
  skills(id) {
    return query('SELECT name, pic FROM game_skills WHERE game_id = $1', id);
  }

  /**
   * Get game pics
   * @param {number} id
   * @return {Promise<any>} pics
   */
  async pics(id) {
    const [pics] = await query('SELECT icon, main, background, logo FROM game_pics WHERE game_id = $1', id);
    return pics;
  }
}
