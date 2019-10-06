import {query} from '../services/db.js';
import faker from 'faker';
import uuid from 'uuid/v4.js';

/**
 * Shuffle array
 * @param {Array<any>} arr
 * @return {Array<any>} shuffled array
 */
function shuffle(arr) {
  return arr.sort(() => Math.random() - Math.random());
}

/**
 * Cleans tables
 */
async function clean() {
  await query('TRUNCATE TABLE users');
  await query('TRUNCATE TABLE trainers');
  await query('TRUNCATE TABLE user_games');
  await query('ALTER SEQUENCE users_id_seq RESTART');
  await query('ALTER SEQUENCE trainers_id_seq RESTART');
}

/**
 * Adds random user
 * @return {Promise<Number>} User id
 */
async function addUser() {
  const email = faker.internet.email();
  const name = faker.name.findName();
  const pic = uuid();
  const [{id}] = await query('INSERT INTO users(email, name, pic) VALUES($1, $2, $3) RETURNING id', email, name, pic);
  return id;
}

/**
 * Adds random trainer
 * @param {Number} id user id
 * @return {Promise} Added
 */
function addTrainer(id) {
  const [rank] = shuffle(['TOP', 'MASTER', 'EXPERT']);
  const rate = Number((faker.random.number() / faker.random.number()).toFixed(2));
  const streamer = faker.random.boolean();
  return query('INSERT INTO trainers(users_id, rank, rate, streamer) VALUES($1, $2, $3, $4) RETURNING id',
      id, rank, rate, streamer);
}

/**
 * Adds random game
 * @param {Number} id user id
 * @return {Promise} Added
 */
async function addGame(id) {
  const [game, game1] = shuffle([1, 2, 3]);
  const trains = faker.random.boolean();
  await query('INSERT INTO user_games(users_id, games_id, trains) VALUES($1, $2, $3)', id, game, trains);
  const isGame1 = faker.random.boolean();
  if (!isGame1) {
    return;
  }
  const trains1 = faker.random.boolean();
  return query('INSERT INTO user_games(users_id, games_id, trains) VALUES($1, $2, $3)', id, game1, trains1);
}


/**
 * Fill users with random data
 * @param {Number} length
 * @return {Promise} Filled
 */
export async function fill(length) {
  await clean();
  const users = [];
  for (let i = 0; i < length; i++) {
    users.push(addUser());
  }
  const ids = await Promise.all(users);
  const trainersUserIds = shuffle(ids).slice(0, Math.round(length / 4));
  const trainers = trainersUserIds.map(addTrainer);
  await Promise.all(trainers);
  const games = trainersUserIds.map(addGame);
  await Promise.all(games);
}
