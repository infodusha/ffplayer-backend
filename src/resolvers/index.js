import scalars from './scalars/index.js';
import Client from './Client.js';
import User from './User.js';
import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';
import Game from './Game.js';
import Review from './Review.js';

export const resolvers = {
  ...scalars,
  ...Client,
  ...Game,
  ...Review,
  ...User,
  ...Trainer,
  ...Query,
  ...Mutation,
};
