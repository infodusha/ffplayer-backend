import {getUserGames} from '../providers/client.js';

export default {
  Trainer: {
    games({id}) {
      return getUserGames(id);
    },
  },
};
