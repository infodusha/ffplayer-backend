import {getUserGames} from '../providers/client.js';
import {getTrainerReviews, getTrainerRateData} from '../providers/Trainer.js';

export default {
  Trainer: {
    games({id}) {
      return getUserGames(id);
    },
    reviews({id}) {
      return getTrainerReviews(id);
    },
    rateData({id, gamesId = null}) {
      return getTrainerRateData(id, gamesId);
    },
  },
};
