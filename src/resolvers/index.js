import scalars from './scalars/index.js';
import User from './User.js';
import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';

export default {
  ...scalars,
  ...User,
  ...Trainer,
  ...Query,
  ...Mutation,
};
