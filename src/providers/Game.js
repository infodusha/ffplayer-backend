import {query} from '../services/db.js';

/**
 * Get game skills
 * @param {number} id
 * @return {Promise<Array<any>>} skills
 */
export function getSkills(id) {
  return query('SELECT name, pic FROM game_skills WHERE games_id = $1', id);
}

/**
 * Get game pics
 * @param {number} id
 * @return {Promise<any>} pics
 */
export async function getPics(id) {
  const [pics] = await query('SELECT icon, main, background, logo FROM game_pics WHERE games_id = $1', id);
  return pics;
}
