import {getNews} from '../providers/news.js';
import {getTrainers} from '../providers/trainers.js';

export default {
  Query: {
    trainers(parent, {rank, streamer, game}) {
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
