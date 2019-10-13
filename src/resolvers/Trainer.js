import {getUserGames} from '../providers/user.js';

export default {
  Trainer: {
    games({id}) {
      return getUserGames(id);
    },
  },
};
