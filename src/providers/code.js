import {ApolloError} from '../services/error.js';
import {send} from '../services/mail.js';
import {Coder} from '../services/coder.js';
import config from '../../config.json';
import {hash} from '../services/auth.js';

const {lifetime, attempts} = config.auth.code;
export const codes = new Coder(lifetime, attempts);

/**
 * Test coditions, generate, send, save code
 * @param {string} email
 * @param {{}} dataSources
 * @return {Promise<boolean>} user has name
 */
export async function postCode(email, dataSources) {
  const emailHash = hash(email);
  if (codes.has(emailHash)) {
    throw new ApolloError('User already got code');
  }
  const code = await codes.add(emailHash);
  const [inUsers] = await Promise.all([
    dataSources.user.getByEmail(emailHash),
    send({
      from: 'no-reply@ffplayer.pro',
      to: email,
      subject: 'Auth code: ' + code,
      text: 'Auth code: ' + code,
    }),
  ]);
  return Boolean(inUsers);
}
