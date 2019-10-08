import {getNews} from '../providers/news.js';
import {getTrainers} from '../providers/trainers.js';
import {getToken} from '../providers/token.js';
import {getGames} from '../providers/games.js';

export default {
  Query: {
    trainers(parent, {rank = null, streamer = null, game = null, cursor = 0, length}) {
      return getTrainers(rank, streamer, game, cursor, length);
    },
    token(parent, {name, email, code}, {ip}) {
      return getToken(name, email, code, ip);
    },
    news(parent, {cursor = 0, length}) {
      return getNews(cursor, length);
    },
    games() {
      return getGames();
    },
  },
};
