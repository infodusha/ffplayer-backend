import {ApolloError} from '../services/error.js';
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
    throw new ApolloError('User already got code');
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
 * Get user id and add user if needed
 * @param {string} email
 * @param {string} name
 * @return {number} id
 */
async function getId(email, name) {
  const [user] = await query('SELECT id FROM users WHERE email = $1', email);
  if (!user) {
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
  const authDB = await getAuth(email);
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
