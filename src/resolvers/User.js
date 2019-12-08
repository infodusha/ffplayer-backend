import {getClientGames} from '../providers/client.js';
import {getUserReviews} from '../providers/User.js';
import {isOnline} from '../services/status.js';

export const User = {
  User: {
    games({id}) {
      return getClientGames(id);
    },
    reviews({id}) {
      return getUserReviews(id);
    },
    online({id}) {
      return isOnline(id);
    },
  },
};
