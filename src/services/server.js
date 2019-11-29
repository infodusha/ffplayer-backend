import http from 'http';
import express from 'express';
import apollo from 'apollo-server-express';
import config from '../../config.json';
import {logger} from './logger.js';
import {fill} from '../providers/temp.js';
import fs from 'fs';

/**
 * Create server
 * @return {any} app
 */
function create() {
  const app = express();

  app.get('/image/:uuid', async (req, res) => {
    try {
      const data = await fs.promises.readFile('images/' + req.params.uuid);
      res.end(data, 'binary');
    } catch {
      res.status(400).send('Bad Request');
    }
  });

  // TODO: remove
  app.get('/temp/:length', async (req, res) => {
    try {
      await fill(Number(req.params.length));
      res.end('Filled');
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
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

  await new Promise((resolve, reject) => httpServer.listen(config.apollo.server, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));

  const {host, port} = config.apollo.server;
  logger.info(`Server listening at http://${host}:${port}${server.graphqlPath}`);
  logger.info(`Subscriptions listening at ws://${host}:${port}${server.subscriptionsPath}`);
}
