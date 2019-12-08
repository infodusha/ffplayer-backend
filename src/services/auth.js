import {createHash} from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from '../../config.json';

let authKey = null;

/**
 * Configure auth service
 * @param {any} config
 * @return {Promise} service configured
 */
export async function configure(config) {
  authKey = await fs.promises.readFile(config.key, {encoding: 'utf8'});
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
export function sign(data) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, authKey, {algorithm: 'RS256'}, (err, token) => {
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
export function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, authKey, {algorithms: ['RS256']}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
