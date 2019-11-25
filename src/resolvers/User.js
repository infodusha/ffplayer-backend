import {getUserGames} from '../providers/client.js';
import {getUserReviews} from '../providers/User.js';

export default {
  User: {
    games({id}) {
      return getUserGames(id);
    },
    reviews({id}) {
      return getUserReviews(id);
    },
  },
};
