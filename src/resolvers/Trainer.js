import {getClientGames} from '../providers/client.js';
import {getTrainerReviews, getTrainerRateData} from '../providers/Trainer.js';
import {isOnline} from '../services/status.js';

export default {
  Trainer: {
    games({id}) {
      return getClientGames(id);
    },
    reviews({id}) {
      return getTrainerReviews(id);
    },
    rateData({id, gamesId = null}) {
      return getTrainerRateData(id, gamesId);
    },
    online({id}) {
      return isOnline(id);
    },
  },
};
