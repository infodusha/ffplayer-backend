import {query} from '../services/db.js';
import {getTrainers} from '../providers/trainers.js';
import {getToken} from '../providers/token.js';

export default {
  Query: {
    trainers(parent, {rank = null, streamer = null, game = null, cursor = 0, length}) {
      return getTrainers(rank, streamer, game, cursor, length);
    },
    token(parent, {name, email, code}, {ip}) {
      return getToken(name, email, code, ip);
    },
    news(parent, {cursor = 0, length}) {
      return query('SELECT * FROM news WHERE id > $1 LIMIT $2', cursor, length);
    },
    games() {
      return query('SELECT id, name, shortname, description, tags, site FROM games');
    },
    async user(parent, {id}) {
      const [data] = await query('SELECT id, pic, name FROM users WHERE id = $1', id);
      return data;
    },
    async game(parent, {shortname}) {
      const [game] = await query(`SELECT id, name, shortname, description, tags, site
          FROM games WHERE shortname = $1`, shortname);
      return game;
    },
  },
};
