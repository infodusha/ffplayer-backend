import {ApolloError} from '../services/error.js';
import {query} from '../services/db.js';
import * as auth from '../services/auth.js';
import {getCode} from './code.js';

/**
 * Get user id and add user if needed
 * @param {string} email
 * @param {string} name
 * @return {number} id
 */
async function getId(email, name) {
  const [user] = await query('SELECT id FROM users WHERE email = $1', email);
  if (!user) {
    if (!name) {
      throw new ApolloError('User not exists, name is necessarily');
    }
    return query('INSERT INTO users(email, name) VALUES($1, $2) RETURNING id', email, name);
  }
  if (name) {
    throw new ApolloError('User already exists, name is unnecessarily');
  }
  return user.id;
}

/**
 * Check code and generate token
 * @param {string} name
 * @param {string} email
 * @param {string} code
 * @param {string} ip
 * @return {string} token
 */
export async function getToken(name, email, code, ip) {
  const authDB = await getCode(email);
  if (authDB === null) {
    throw new ApolloError('Code expired');
  }
  if (authDB.attempts <= 0) {
    throw new ApolloError('Reached maximum attempts');
  }
  const correct = await auth.compare(code, authDB.code);
  if (!correct) {
    await query('UPDATE auth SET attempts = attempts - 1 WHERE email = $1', email);
    throw new ApolloError('Code not correct');
  }
  const id = await getId(email, name);
  await query('DELETE FROM auth WHERE email = $1', email);
  return auth.sign({id, ip});
}
