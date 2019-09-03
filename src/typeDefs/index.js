import scalars from './scalars/index.js';
import directives from './directives/index.js';
import enums from './enums/index.js';
import interfaces from './interfaces/index.js';
import News from './News.js';
import Trainer from './Trainer.js';
import Query from './Query.js';
import Mutation from './Mutation.js';

export default [
  scalars,
  ...directives,
  ...enums,
  ...interfaces,
  News,
  Trainer,
  Query,
  Mutation,
];
