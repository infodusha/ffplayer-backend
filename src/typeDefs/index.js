import {scalars} from './scalars/index.js';
import {directives} from './directives/index.js';
import {enums} from './enums/index.js';
import {unions} from './unions/index.js';
import {News} from './News.js';
import {User} from './User.js';
import {Trainer} from './Trainer.js';
import {Query} from './Query.js';
import {Mutation} from './Mutation.js';
import {Game} from './Game.js';
import {Review} from './Review.js';
import {RateData} from './RateData.js';
import {Subscription} from './Subscription.js';
import {Status} from './Status.js';
import {SelfTrainer} from './SelfTrainer.js';
import {SelfUser} from './SelfUser.js';

export const typeDefs = [
  scalars,
  ...directives,
  ...enums,
  ...unions,
  News,
  User,
  Game,
  RateData,
  Review,
  Trainer,
  Query,
  Mutation,
  Status,
  Subscription,
  SelfTrainer,
  SelfUser,
];
