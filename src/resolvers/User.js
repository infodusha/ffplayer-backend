import {getUserGames} from '../providers/client.js';

export default {
  User: {
    games({id}) {
      return getUserGames(id);
    },
  },
};
