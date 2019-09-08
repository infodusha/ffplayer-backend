import apollo from 'apollo-server-express';
import * as auth from './services/auth.js';
import logger from './services/logger.js';

/**
 * Create context
 * @param {string} ip
 * @param {string} authorization
 * @return {{ip:string, user}|{ip:string}} context
 */
export async function createContext(ip, authorization) {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    if (token) {
      try {
        const user = await auth.verify(token);
        if (user.ip !== ip) {
          throw new apollo.AuthenticationError('IP adress does not match');
        }
        return {ip, user};
      } catch (err) {
        logger.debug(err);
        throw new apollo.AuthenticationError(err.message);
      }
    }
  }
  return {ip};
}

/**
 * Context shaper
 * @param {{ req, connection }} context
 * @return {any} context
 */
export default function context({req, connection}) {
  if (connection) {
    return connection.context;
  }
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  const authorization = req.headers.authorization;
  return createContext(ip, authorization);
}
