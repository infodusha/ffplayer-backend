import {getUserGames} from '../providers/user.js';

export default {
  User: {
    games({id}) {
      return getUserGames(id);
    },
  },
};
