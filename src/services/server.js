import http from 'http';
import util from 'util';
import express from 'express';
import apollo from 'apollo-server-express';
import config from '../../config.json';
import logger from './logger.js';
import {getImageById} from './image.js';

/**
 * Create server
 * @return {any} app
 */
function create() {
  const app = express();

  app.get('/image/:id', async (req, res) => {
    try {
      const {data, contentType} = await getImageById(req.params.id);
      res.set('Content-Type', contentType);
      res.send('' + data);
    } catch (err) {
      res.status(400).send('Bad Request');
    }
  });

  return app;
}

/**
 * Create and listen server
 * @param {any} options server options
 * @return {Promise<any>} server
 */
export async function listen(options) {
  const app = create();
  const server = new apollo.ApolloServer(options);

  server.applyMiddleware({app, cors: config.apollo.cors, path: config.apollo.path});

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  await util.promisify(httpServer.listen).call(httpServer, config.apollo.server);

  const {host, port} = config.apollo.server;
  logger.info(`Server listening at http://${host}:${port}${server.graphqlPath}`);
  logger.info(`Subscriptions listening at ws://${host}:${port}${server.subscriptionsPath}`);
}
