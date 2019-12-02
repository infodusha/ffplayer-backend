import {getUserGames} from '../providers/client.js';
import {getUserReviews} from '../providers/User.js';
import {isOnline} from '../services/status.js';

export default {
  User: {
    games({id}) {
      return getUserGames(id);
    },
    reviews({id}) {
      return getUserReviews(id);
    },
    online({id}) {
      return isOnline(id);
    },
  },
};
