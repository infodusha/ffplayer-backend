import {query} from '../services/db.js';

/**
 * Get games
 * @return {Promise<Array<any>>} games
 */
export function getGames() {
  return query('SELECT id, name, shortname, description, tags, site FROM games');
}

/**
 * Get game
 * @param {string} shortname
 * @return {Promise<any>} game
 */
export async function getGameByShortname(shortname) {
  const [game] = await query('SELECT id, name, shortname, description, tags, site FROM games WHERE shortname = $1', shortname);
  return game;
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

/**
 * Get game slills
 * @param {number} id
 * @return {Promise<Array<any>>} slills
 */
export function getSkills(id) {
  return query('SELECT name, pic FROM game_skills WHERE games_id = $1', id);
}
