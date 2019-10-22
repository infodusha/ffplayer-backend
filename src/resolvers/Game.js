import {getSkills, getPics} from '../providers/Game.js';

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
