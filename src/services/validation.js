import v8n from 'v8n';
import apollo from 'apollo-server-express';

/**
 * Run validation
 * @param {function(validator)} callback
 */
export function validate(callback) {
  try {
    callback(v8n);
  } catch (err) {
    const message = `Validation ${err.rule.name}(${err.rule.args.join()}) failed on value ${err.value}`;
    throw new apollo.ValidationError(message);
  }
}
