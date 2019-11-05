import {validate} from '../services/validation.js';
import {getToken} from '../providers/token.js';
import {getGame, getNews, getGames, getTrainers, getUser} from '../providers/Query.js';

export default {
  Query: {
    trainers(_, {rank = null, streamer = null, game = null, offset = 0, length}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return getTrainers(rank, streamer, game, offset, length);
    },
    token(_, {name, email, code}, {ip}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return getToken(name, email, code, ip);
    },
    news(_, {offset = 0, length}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return getNews(offset, length);
    },
    games() {
      return getGames();
    },
    user(_, {id}) {
      return getUser(id);
    },
    self(_, __, {user}) {
      return getUser(user.id);
    },
    game(_, {shortname}) {
      return getGame(shortname);
    },
  },
};
