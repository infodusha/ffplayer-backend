import {ApolloError} from '../services/error.js';
import {query} from '../services/db.js';
import * as mail from '../services/mail.js';
import {Coder} from '../services/coder.js';
import config from '../../config.json';

const {lifetime, attempts} = config.auth.code;
export const codes = new Coder(lifetime, attempts);

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
 * Test coditions, generate, send, save code
 * @param {string} email
 * @return {Promise<boolean>} user has name
 */
export async function postCode(email) {
  if (codes.has(email)) {
    throw new ApolloError('User already got code');
  }
  const code = await codes.add(email);
  const [inUsers] = await Promise.all([
    query('SELECT id from users WHERE email = $1', email),
    send(email, code),
  ]);
  return Boolean(inUsers.length);
}
