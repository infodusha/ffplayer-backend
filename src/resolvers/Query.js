import {query} from '../services/db.js';
import {validate} from '../services/validation.js';
import {getTrainers} from '../providers/trainers.js';
import {getToken} from '../providers/token.js';

export default {
  Query: {
    trainers(parent, {rank = null, streamer = null, game = null, offset = 0, length}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return getTrainers(rank, streamer, game, offset, length);
    },
    token(parent, {name, email, code}, {ip}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return getToken(name, email, code, ip);
    },
    news(parent, {offset = 0, length}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return query('SELECT id, title, text, date FROM news ORDER BY date DESC OFFSET $1 LIMIT $2', offset, length);
    },
    games() {
      return query('SELECT id, name, shortname, description, tags, site FROM games ORDER BY id');
    },
    async user(parent, {id}) {
      validate((validator) => {
        validator().number().greaterThan(0).check(id);
      });
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
