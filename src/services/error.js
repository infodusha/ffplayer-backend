import apollo from 'apollo-server-express';
import errors from '../../errors.json';

/**
 * ApolloError class
 */
export class ApolloError extends apollo.ApolloError {
  /**
   * Create Apollo Error
   * @param {string} message
   */
  constructor(message) {
    if (message instanceof Error) {
      super(message.message, 0);
    } else {
      const err = errors.find((err) => err.message === message);
      if (err) {
        super(err.message, err.code);
      } else {
        super(message, -1);
      }
    }
  }
}
