import {createHash} from 'crypto';
import {promises as fs} from 'fs';
import jwt from 'jsonwebtoken';
import config from '../../config.json';

/**
 * Auth key storage
 */
class AuthKey {
  /**
   * Get auth key
   * @return {Promise<String>} key
   */
  static get() {
    if (AuthKey.key) {
      return Promise.resolve(AuthKey.key);
    }
    if (!AuthKey.loader) {
      AuthKey.loader = fs
          .readFile(config.auth.key, {encoding: 'utf8'})
          .then((key) => AuthKey.key = key);
    }
    return AuthKey.loader;
  }
}

/**
 * Get hash for string
 * @param {string} str
 * @return {string} hash
 */
export function hash(str) {
  return createHash(config.auth.algorithm).update(str).digest('hex');
}

/**
 * Copmare string and hash
 * @param {string} str
 * @param {string} hashStr
 * @return {Boolean} is hash from string
 */
export function compare(str, hashStr) {
  return hash(str) === hashStr;
}

/**
 * Sign data
 * @param {any} data
 * @return {Promise<String>} signed data
 */
export async function sign(data) {
  const key = await AuthKey.get();
  return new Promise((resolve, reject) => {
    jwt.sign(data, key, {algorithm: 'RS256'}, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Verify & decode token
 * @param {string} token
 * @return {Promise<any>} decoded data
 */
export async function verify(token) {
  const key = await AuthKey.get();
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, {algorithms: ['RS256']}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
