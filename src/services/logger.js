import winston from 'winston';
import config from '../../config.json';

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({filename: 'logs/logger.log'}),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
