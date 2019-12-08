import {validate} from '../services/validation.js';
import {getToken} from '../providers/token.js';
import {getGame, getNews, getGames, getTrainers} from '../providers/Query.js';
import {getClient} from '../providers/client.js';

export const Query = {
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
      return getToken(name, email.toLowerCase(), code.toUpperCase(), ip);
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
      return getClient(id);
    },
    self(_, __, {user}) {
      return getClient(user.id);
    },
    game(_, {shortname}) {
      return getGame(shortname);
    },
  },
};
