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
    if (!err.rule) {
      throw err;
    }
    let message = `Validation '${err.rule.name}'`;
    if (err.rule.args.length) {
      message += `(${err.rule.args.join()})`;
    }
    message += ` failed on value ${err.value}`;
    throw new apollo.ValidationError(message);
  }
}
