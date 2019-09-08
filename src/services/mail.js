import mailer from 'nodemailer';
import config from '../../config.json';
import logger from './logger.js';

const transport = mailer.createTransport({
  ...config.mail,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send email
 * @param {{ from: string, to: string, subject: string, text: string, html: string }} options email options
 * @return {Promise<any>} message id
 */
export function send(options) {
  return new Promise((resove, reject) => {
    transport.sendMail(options, (err, info) => {
      if (err) {
        logger.error('Error sending message', err);
        reject(err);
      } else {
        logger.debug('Message sent', options);
        resove(info.messageId);
      }
    });
  });
}
