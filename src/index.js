import './env.js';
import config from '../config.json';
import {logger} from './services/logger.js';
import {configure} from './services/auth.js';
import {listen} from './services/server.js';
import {connect} from './services/db.js';
import {schemaDirectives} from './schemaDirectives/index.js';
import {typeDefs} from './typeDefs/index.js';
import {resolvers} from './resolvers/index.js';
import {context} from './context.js';
import {subscriptions} from './subscriptions.js';


(async () => {
  try {
    await configure(config.auth);
    await connect();
    await listen({
      typeDefs,
      resolvers,
      schemaDirectives,
      context,
      subscriptions,
      playground: config.apollo.playground,
      debug: config.apollo.debug,
    });
  } catch (err) {
    logger.error('Start error', err);
  }
})();
