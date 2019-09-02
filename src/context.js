import apollo from 'apollo-server-express';
import * as auth from './services/auth.js';
import logger from './services/logger.js';

/**
 * Context shaper
 * @param {{ req, connection }} context
 * @return {any} context
 */
export default async function context({req, connection}) {
  if (connection) {
    return connection.context;
  }

  const ip = req.connection.remoteAddress;
  const authorization = req.headers.authorization;

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
        logger.error(err);
        throw new apollo.AuthenticationError(err.message);
      }
    }
  }

  return {ip};
}
