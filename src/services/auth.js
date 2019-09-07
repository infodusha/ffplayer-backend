import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import util from 'util';
import fs from 'fs';

const jwtSign = util.promisify(jwt.sign).bind(jwt);

const jwtVerify = util.promisify(jwt.verify).bind(jwt);

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
 * Get hash for string
 * @param {string} string
 * @return {Promise<string>} hash
 */
export async function hash(string) {
  const salt = await bcrypt.genSalt(cfg.saltRounds);
  return bcrypt.hash(string, salt);
}

/**
 * Copmare string and hash
 * @param {string} string
 * @param {string} hash
 * @return {Promise<Boolean>} is hash from string
 */
export function compare(string, hash) {
  return bcrypt.compare(string, hash);
}

/**
 * Sign data
 * @param {any} data
 * @return {Promise<String>} signed data
 */
export function sign(data) {
  return jwtSign.call(data, cfg.key, {algorithm: 'RS256'});
}

/**
 * Verify & decode token
 * @param {string} token
 * @return {Promise<any>} decoded data
 */
export function verify() {
  return jwtVerify.call(token, cfg.key, {algorithms: ['RS256']});
}
