import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';

export default {
  ...Trainer,
  ...Query,
  ...Mutation,
};
