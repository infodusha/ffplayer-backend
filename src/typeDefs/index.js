import directives from './directives/index.js';
import enums from './enums/index.js';
import interfaces from './interfaces/index.js';
import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';

export default [
  ...directives,
  ...enums,
  ...interfaces,
  Trainer,
  Query,
  Mutation,
];
