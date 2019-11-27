import {ApolloError} from '../services/error.js';
import {query} from '../services/db.js';
import * as auth from '../services/auth.js';
import * as mail from '../services/mail.js';

export const codes = new Map();

/**
 * Get code from database
 * @param {string} email
 * @return {Promise<string>} code
 */
export async function getCode(email) {
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
 * @return {Promise<boolean>} user has name
 */
export async function postCode(email) {
  const authCode = codes.get(email);
  if (authCode !== null) {
    throw new ApolloError('User already got code');
  }
  const code = await auth.code();
  const [inUsers] = await Promise.all([
    query('SELECT id from users WHERE email = $1', email),
    send(email, code),
  ]);
  codes.set(email, {code, attempts: 0, expires: Date.now()});
  return Boolean(inUsers.length);
}
