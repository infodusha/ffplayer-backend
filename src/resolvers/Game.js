import {getPics, getSkills} from '../providers/games.js';

export default {
  Game: {
    pics({id}) {
      return getPics(id);
    },
    skills({id}) {
      return getSkills(id);
    },
  },
};
