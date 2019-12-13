import {isOnline} from '../services/status.js';

export const User = {
  User: {
    games({id}, _, {dataSources}) {
      return dataSources.user.games(id);
    },
    reviews({id}, _, {dataSources}) {
      return dataSources.user.reviews(id);
    },
    online({id}) {
      return isOnline(id);
    },
  },
};
