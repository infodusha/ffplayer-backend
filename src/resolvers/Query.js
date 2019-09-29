import {getNews} from '../providers/news.js';
import {getTrainers} from '../providers/trainers.js';
import {getToken} from '../providers/token.js';

export default {
  Query: {
    trainers(parent, {rank = null, streamer = null, game = null, first = 0, length}) {
      return getTrainers(rank, streamer, game, first, length);
    },
    token(parent, {name, email, code}, {ip}) {
      return getToken(name, email, code, ip);
    },
    news(parent, {first = 0, length}) {
      return getNews(first, length);
    },
  },
};
