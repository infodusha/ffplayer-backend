import {query} from '../services/db.js';
import faker from 'faker';
import fs from 'fs';
import {saveRandomPic} from '../services/gravatar.js';
import {hash} from '../services/auth.js';
import {codes} from './code.js';

/**
 * Get probability
 * @param {number} percent
 * @return {boolean} is probable
 */
function probability(percent) {
  return (faker.random.number(99) + 1) <= percent;
}

/**
 * Cleans data
 */
async function clean() {
  const gameSkills = await query('SELECT pic FROM game_skills');
  const gamePics = await query('SELECT icon, main, background, logo FROM game_pics');
  const whitePics = gamePics
      .map(({icon, main, background, logo}) => [icon, main, background, logo])
      .flat()
      .concat(gameSkills.map(({pic}) => pic));
  const files = await fs.promises.readdir('images');
  const unlinkPromises = files
      .filter((filename) => !whitePics.includes(filename))
      .map((filename) => fs.promises.unlink(`images/${filename}`));
  await Promise.all(unlinkPromises);
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
}

/**
 * Adds our prepared users
 */
async function addPrepared() {
  const emailHash = hash('admin@ffplayer.pro');
  const gameId = 1;
  const pic = await saveRandomPic(emailHash);
  const [{id}] = await query(`INSERT INTO users(email, name, pic) VALUES($1, $2, $3)
        RETURNING user_id AS id`, emailHash, 'Admin', pic);
  await query('INSERT INTO trainers(user_id, rank, game_id) VALUES($1, $2, $3)', id, 'TOP', gameId);
  await query('INSERT INTO user_games(user_id, game_id) VALUES($1, $2)', id, gameId);
  await query(`INSERT INTO reviews(user_id, trainer_id, title, text, date, game_id)
      VALUES($1, $2, $3, $4, $5, $6)`, id, id, 'Отзыв 1', 'Текст 1', '2019-10-05 02:00:00+03', gameId);
  await query(`INSERT INTO reviews(user_id, trainer_id, title, text, date, game_id)
      VALUES($1, $2, $3, $4, $5, $6)`, id, id, 'Отзыв 2', 'Текст 2', '2019-7-15 01:00:00+03', gameId);
  codes._items.clear();
  codes._items.set(emailHash, {
    code: hash('ADMIN'),
    expires: Date.now() + 10000000,
    attempts: 20,
  });
}

/**
 * Adds random user
 * @return {Promise<Number>} User id
 */
async function addUser() {
  const email = faker.internet.email();
  const emailHash = hash(email);
  const name = faker.name.findName();
  const pic = await saveRandomPic(emailHash);
  const [{id}] = await query(`INSERT INTO users(email, name, pic) VALUES($1, $2, $3)
        RETURNING user_id AS id`, emailHash, name, pic);
  if (probability(80)) {
    const gameId = faker.random.number(2) + 1;
    await query('INSERT INTO user_games(user_id, game_id) VALUES($1, $2)', id, gameId);
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
        await query('INSERT INTO user_games(user_id, game_id) VALUES($1, $2)', id, gameId2);
        await addTrainer(id, gameId2);
        if (probability(70)) {
          await addReview(id, gameId2);
        }
        if (probability(50)) {
          await query('INSERT INTO streamers(user_id, game_id) VALUES($1, $2)', id, gameId2);
        }
      }
    }
    if (probability(50)) {
      await query('INSERT INTO streamers(user_id, game_id) VALUES($1, $2)', id, gameId);
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
  return query('INSERT INTO trainers(user_id, rank, game_id) VALUES($1, $2, $3)', id, rank, gameId);
}

/**
 * Adds random review
 * @param {Number} id user id
 * @param {Number} gameId
 * @return {Promise} Added
 */
async function addReview(id, gameId) {
  const title = faker.lorem.word();
  const text = faker.lorem.sentence();
  const date = faker.date.past();
  const [{id: reviewId}] = await query(`INSERT INTO reviews(user_id, trainer_id, title, text, date, game_id)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING review_id AS id`, id, id, title, text, date, gameId);
  const [{m}] = await query('SELECT MAX(vote_id) AS m FROM votes');
  for (let i = 1; i < (m + 1); i++) {
    await addReviewVote(reviewId, i);
  }
}

/**
 * Adds random review vote
 * @param {Number} id review id
 * @param {Number} votesId
 * @return {Promise} Added
 */
function addReviewVote(id, votesId) {
  const value = faker.random.number(4) + 1;
  return query(`INSERT INTO review_votes(review_id, value, vote_id)
      VALUES($1, $2, $3)`, id, value, votesId);
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
