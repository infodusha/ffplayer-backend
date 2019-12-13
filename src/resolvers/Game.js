export const Game = {
  Game: {
    pics({id}, _, {dataSources}) {
      return dataSources.game.pics(id);
    },
    skills({id}, _, {dataSources}) {
      return dataSources.game.skills(id);
    },
  },
};
