import {query} from '../services/db.js';

export default {
  Game: {
    async pics({id}) {
      const [pics] = await query('SELECT icon, main, background, logo FROM game_pics WHERE games_id = $1', id);
      return pics;
    },
    skills({id}) {
      return query('SELECT name, pic FROM game_skills WHERE games_id = $1', id);
    },
  },
};
