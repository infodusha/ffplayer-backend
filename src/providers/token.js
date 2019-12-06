import {ApolloError} from '../services/error.js';
import {query} from '../services/db.js';
import {hash, sign} from '../services/auth.js';
import {codes} from './code.js';
import {saveRandomPic} from '../services/gravatar.js';

/**
 * Get user id and add user if needed
 * @param {string} email
 * @param {string} name
 * @return {Promise<number>} id
 */
async function getId(email, name) {
  const [user] = await query('SELECT user_id AS id FROM users WHERE email = $1', email);
  if (!user) {
    if (!name) {
      throw new ApolloError('User not exists, name is necessarily');
    }
    const pic = await saveRandomPic(email);
    const [user] = await query(`INSERT INTO users(email, name, pic)
          VALUES($1, $2, $3) RETURNING user_id AS id`, email, name, pic);
    return user.id;
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
 * @return {Promise<string>} token
 */
export async function getToken(name, email, code, ip) {
  const emailHash = hash(email);
  if (!codes.has(emailHash)) {
    throw new ApolloError('Code expired');
  }
  if (!codes.hasAttempts(emailHash)) {
    throw new ApolloError('Reached maximum attempts');
  }
  const correct = codes.check(emailHash, code);
  if (!correct) {
    throw new ApolloError('Code not correct');
  }
  const id = await getId(emailHash, name);
  return sign({id, ip});
}
