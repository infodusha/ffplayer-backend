import {getUserGames} from '../providers/client.js';
import {getTrainerReviews} from '../providers/Trainer.js';

export default {
  Trainer: {
    games({id}) {
      return getUserGames(id);
    },
    reviews({id}) {
      return getTrainerReviews(id);
    },
  },
};
