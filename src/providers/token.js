import apollo from 'apollo-server-express';
import {query} from '../services/db.js';
import * as auth from '../services/auth.js';
import * as mail from '../services/mail.js';

/**
 * Get code from database
 * @param {string} email
 * @return {string} code
 */
async function getAuth(email) {
  const codes = await query('SELECT code, attempts FROM auth WHERE email = $1 AND expires > NOW()', email);
  return codes.length ? codes[0] : null;
}

/**
 * Send code
 * @param {string} email
 * @param {string} code
 * @return {Promise<undefined>} Complete
 */
function send(email, code) {
  return mail.send({
    from: 'no-reply@ffplayer.pro',
    to: email,
    subject: 'Auth code: ' + code,
    text: 'Auth code: ' + code,
  });
}

/**
 * Save code
 * @param {string} email
 * @param {string} code
 * @return {Promise<undefined>} Complete
 */
async function save(email, code) {
  const codeHash = await auth.hash(code);
  return query('INSERT INTO auth (email, code) VALUES ($1, $2)', email, codeHash);
}

/**
 * Test coditions, generate, send, save code
 * @param {string} email
 * @return {boolean} user has name
 */
export async function codeFor(email) {
  const authDB = await getAuth(email);
  if (authDB !== null) {
    throw new apollo.ApolloError('User already got code', 15);
  }
  const code = await auth.code();
  const [inUsers] = await Promise.all([
    query('SELECT id from users WHERE email = $1', email),
    send(email, code),
    save(email, code),
  ]);
  return Boolean(inUsers.length);
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
  const authDB = await getAuth(email);
  if (authDB === null) {
    throw new apollo.ApolloError('Code expired', 14);
  }
  if (authDB.attempts <= 0) {
    throw new apollo.ApolloError('Reached naximum attempts', 13);
  }
  const correct = await auth.compare(code, dbCode);
  if (!correct) {
    await query('UPDATE auth SET attempts = attempts - 1 WHERE email = $1::text', email);
    throw new apollo.ApolloError('Code not correct', 12);
  }
  return auth.sign({id, ip});
}
