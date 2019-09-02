import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

const cfg = {
  key: null,
  saltRounds: null,
};

/**
 * Configure auth service
 * @param {any} config
 * @return {Promise} service configured
 */
export async function configure(config) {
  cfg.saltRounds = config.saltRounds;
  cfg.key = await fs.promises.readFile(config.key, {encoding: 'utf8'});
}

/**
 * Get hash for password
 * @param {string} password
 * @return {Promise<string>} password hash
 */
export async function hash(password) {
  const salt = await bcrypt.genSalt(cfg.saltRounds);
  return bcrypt.hash(password, salt);
}

/**
 * Copmare password and hash
 * @param {string} password
 * @param {string} hash
 * @return {Promise<Boolean>} is hash from this password
 */
export function compare(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Sign data
 * @param {any} data
 * @return {Promise<String>} signed data
 */
export function sign(data) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, cfg.key, {algorithm: 'RS256'}, (err, token) => {
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
export function verify() {
  return new Promise((resolve, reject) => {
    jwt.verify(token, cfg.key, {algorithms: ['RS256']}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
