import {ApolloError} from '../services/error.js';
import {hash, sign} from '../services/auth.js';
import {saveRandomPic} from '../services/gravatar.js';
import {codes} from './code.js';

/**
 * Get user id and add user if needed
 * @param {string} emailHash
 * @param {string} name
 * @param {{}} dataSources
 * @return {Promise<number>} id
 */
async function getId(emailHash, name, dataSources) {
  const user = await dataSources.user.getByEmail(emailHash);
  if (!user) {
    if (!name) {
      throw new ApolloError('User not exists, name is necessarily');
    }
    const pic = await saveRandomPic(emailHash);
    const user = await dataSources.user.addUser(emailHash, name, pic);
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
 * @param {{}} dataSources
 * @return {Promise<string>} token
 */
export async function getToken(name, email, code, ip, dataSources) {
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
  const id = await getId(emailHash, name, dataSources);
  return sign({id, ip});
}
