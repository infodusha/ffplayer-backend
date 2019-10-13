import scalars from './scalars/index.js';
import Client from './Client.js';
import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';
import Game from './Game.js';

export default {
  ...scalars,
  ...Client,
  ...Game,
  ...Trainer,
  ...Query,
  ...Mutation,
};
