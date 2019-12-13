import {User} from './User.js';
import {Trainer} from './Trainer.js';
import {News} from './News.js';
import {Game} from './Game.js';

export const dataSources = () => ({
  user: new User(),
  trainer: new Trainer(),
  news: new News(),
  game: new Game(),
});
