import {query} from '../services/db.js';
import faker from 'faker';
import uuid from 'uuid/v4.js';
import https from 'https';
import Stream from 'stream';
import fs from 'fs';
import * as auth from '../services/auth.js';

/**
 * Get image from url
 * @param {string} url
 * @return {Promise<Blob>} image
 */
function getImageByUrl(url) {
  return new Promise((resolve, reject) => {
    https.request(url, (response) => {
      const data = new Stream.Transform();

      response.on('data', function(chunk) {
        data.push(chunk);
      });

      response.on('end', () => {
        resolve(data.read());
      });
    }).end();
  });
}

/**
 * Get probability
 * @param {number} percent
 * @return {boolean} is probable
 */
function probability(percent) {
  return (faker.random.number(99) + 1) <= percent;
}

/**
 * Save image to fs
 * @param {string} url
 * @param {string} name
 */
async function saveImage(url, name) {
  const picData = await getImageByUrl(url);
  fs.promises.writeFile('images/' + name, picData);
}

/**
 * Cleans data
 */
async function clean() {
  const gameSkills = await query('SELECT pic FROM game_skills');
  const gamePics = await query('SELECT icon, main, background, logo FROM game_pics');
  const whilePics = gamePics
      .map(({icon, main, background, logo}) => [icon, main, background, logo])
      .flat()
      .concat(gameSkills.map(({pic}) => pic));
  const files = await fs.promises.readdir('images');
  const unlinkPromises = files
      .filter((filename) => !whilePics.includes(filename))
      .map((filename) => fs.promises.unlink(`images/${filename}`));
  await Promise.all(unlinkPromises);
  await query('TRUNCATE TABLE auth');
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
}

/**
 * Adds our prepared users
 */
async function addPrepared() {
  const email = 'admin@ffplayer.pro';
  const pic = uuid();
  const url = faker.internet.avatar();
  const gameId = 1;
  saveImage(url, pic);
  const [{id}] = await query('INSERT INTO users(email, name, pic) VALUES($1, $2, $3) RETURNING id', email, 'Admin', pic);
  await query('INSERT INTO trainers(users_id, rank, games_id) VALUES($1, $2, $3)', id, 'TOP', gameId);
  await query('INSERT INTO user_games(users_id, games_id) VALUES($1, $2)', id, gameId);
  const codeHash = await auth.hash('admin');
  await query('INSERT INTO auth (email, code, attempts, expires) VALUES ($1, $2, $3, $4::timestamptz)',
      email, codeHash, 100, '2050-04-04 20:00:00');
  await query(`INSERT INTO reviews(users_id, trainers_id, rate, title, text, date, games_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)`, id, id, 4, 'Отзыв 1', 'Текст 1', '2019-10-05 02:00:00+03', gameId);
  await query(`INSERT INTO reviews(users_id, trainers_id, rate, title, text, date, games_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)`, id, id, 1, 'Отзыв 2', 'Текст 2', '2019-7-15 01:00:00+03', gameId);
}

/**
 * Adds random user
 * @return {Promise<Number>} User id
 */
async function addUser() {
  const email = faker.internet.email();
  const name = faker.name.findName();
  const pic = uuid();
  const url = faker.internet.avatar();
  saveImage(url, pic);
  const [{id}] = await query('INSERT INTO users(email, name, pic) VALUES($1, $2, $3) RETURNING id', email, name, pic);
  if (probability(80)) {
    const gameId = faker.random.number(2) + 1;
    await query('INSERT INTO user_games(users_id, games_id) VALUES($1, $2)', id, gameId);
    if (probability(70)) {
      await addTrainer(id, gameId);
      if (probability(70)) {
        await addReview(id, gameId);
      }
      if (probability(50)) {
        let gameId2 = faker.random.number(2) + 1;
        do {
          gameId2 = faker.random.number(2) + 1;
        } while (gameId2 === gameId);
        await query('INSERT INTO user_games(users_id, games_id) VALUES($1, $2)', id, gameId2);
        await addTrainer(id, gameId2);
        if (probability(70)) {
          await addReview(id, gameId2);
        }
        if (probability(50)) {
          await query('INSERT INTO streamers(users_id, games_id) VALUES($1, $2)', id, gameId2);
        }
      }
    }
    if (probability(50)) {
      await query('INSERT INTO streamers(users_id, games_id) VALUES($1, $2)', id, gameId);
    }
  }
}

/**
 * Adds random trainer
 * @param {Number} id user id
 * @param {Number} gameId
 * @return {Promise} Added
 */
function addTrainer(id, gameId) {
  const rank = faker.random.arrayElement(['TOP', 'MASTER', 'EXPERT']);
  return query('INSERT INTO trainers(users_id, rank, games_id) VALUES($1, $2, $3)', id, rank, gameId);
}

/**
 * Adds random review
 * @param {Number} id user id
 * @param {Number} gameId
 * @return {Promise} Added
 */
function addReview(id, gameId) {
  const rate = faker.random.number(4) + 1;
  const title = faker.lorem.word();
  const text = faker.lorem.sentence();
  const date = faker.date.past();
  return query(`INSERT INTO reviews(users_id, trainers_id, rate, title, text, date, games_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)`, id, id, rate, title, text, date, gameId);
}

/**
 * Fill users with random data
 * @param {Number} length
 * @return {Promise} Filled
 */
export async function fill(length) {
  await clean();
  if (length > 0) {
    await addPrepared();
  }
  for (let i = 1; i < length; i++) {
    await addUser();
  }
}
