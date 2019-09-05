import {getNews} from '../providers/news.js';
import {getTrainers} from '../providers/trainers.js';

export default {
  Query: {
    trainers(parent, {rank = null, streamer = null, game = null}) {
      return getTrainers(rank, streamer, game);
    },
    token(parent, {code}, {ip}) {
      return 'testtoken';
    },
    news(parent, {first = 0, length}) {
      return getNews(first, length);
    },
  },
};
