import {validate} from '../services/validation.js';
import {getToken} from '../providers/token.js';

export const Query = {
  Query: {
    trainers(_, {rank = null, streamer = null, game = null, offset = 0, length}, {dataSources}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return dataSources.trainer.list(rank, streamer, game, offset, length);
    },
    token(_, {name, email, code}, {ip, dataSources}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return getToken(name, email.toLowerCase(), code.toUpperCase(), ip, dataSources);
    },
    news(_, {offset = 0, length}, {dataSources}) {
      validate((validator) => {
        validator().number().greaterThanOrEqual(0).check(offset);
        validator().number().greaterThan(0).check(length);
      });
      return dataSources.news.list(offset, length);
    },
    games(_, __, {dataSources}) {
      return dataSources.game.list();
    },
    user(_, {id}, {dataSources}) {
      return dataSources.user.getById(id);
    },
    self(_, __, {user, dataSources}) {
      return dataSources.user.getSelfById(user.id);
    },
    game(_, {shortname}, {dataSources}) {
      return dataSources.game.getByShortname(shortname);
    },
  },
};
