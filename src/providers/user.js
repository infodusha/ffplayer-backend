import {query} from '../services/db.js';

/**
 * Get user data by id
 * @param {number} id
 * @return {Promise<any>} user data
 */
export async function getUserById(id) {
  const [data] = await query('SELECT id, pic, name FROM users WHERE id = $1', id);
  return data;
}

/**
 * Get user games
 * @param {number} id
 * @return {Promise<Array<any>>} user games
 */
export function getUserGames(id) {
  return query(`SELECT id, name, shortname, description, tags, site FROM games
                JOIN user_games ON games_id = games.id AND users_id = $1`, id);
}
