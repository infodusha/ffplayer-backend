import {getSkills, getPics} from '../providers/Game.js';

export const Game = {
  Game: {
    pics({id}) {
      return getPics(id);
    },
    skills({id}) {
      return getSkills(id);
    },
  },
};
