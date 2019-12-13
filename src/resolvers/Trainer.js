import {isOnline} from '../services/status.js';

export const Trainer = {
  Trainer: {
    games({id}, _, {dataSources}) {
      return dataSources.user.games(id);
    },
    reviews({id}, _, {dataSources}) {
      return dataSources.trainer.reviews(id);
    },
    rateData({id, gamesId = null}, _, {dataSources}) {
      return dataSources.trainer.rateData(id, gamesId);
    },
    online({id}) {
      return isOnline(id);
    },
  },
};
