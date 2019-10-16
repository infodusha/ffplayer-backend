import {query} from '../services/db.js';

/**
 * Get user games
 * @param {number} id
 * @return {Promise<Array<any>>} user games
 */
export function getUserGames(id) {
  return query(`SELECT id, name, shortname, description, tags, site FROM games
                JOIN user_games ON games_id = games.id AND users_id = $1`, id);
}
