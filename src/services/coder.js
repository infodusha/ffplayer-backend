import crypto from 'crypto';
import {hash, compare} from './auth.js';

/**
 * Generate random code
 */
async function generate() {
  return new Promise((resole, reject) => {
    crypto.randomBytes(3, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resole(buf.toString('hex').toUpperCase());
      }
    });
  });
}

/**
 * Code generator
 */
export class Coder {
  /**
   * Create new code generator
   * @param {Number} lifetime
   * @param {Number} attempts
   */
  constructor(lifetime, attempts) {
    this._items = new Map();
    this._lifetime = lifetime;
    this._attempts = attempts;
    this._cleaner();
  }

  /**
   * Start cleaner
   */
  _cleaner() {
    const now = Date.now();
    for (const [id, {expires}] of this._items.entries()) {
      if (expires <= now) {
        this._items.delete(id);
      }
    }
    setTimeout(this._cleaner.bind(this), this._lifetime);
  }

  /**
   * Add
   * @param {String} id
   * @return {Promise<String>} code
   */
  async add(id) {
    const code = await generate();
    this._items.set(id, {
      code: hash(code),
      expires: Date.now() + this._lifetime,
      attempts: this._attempts,
    });
    return code;
  }

  /**
   * Has
   * @param {String} id
   * @return {Boolean}
   */
  has(id) {
    const item = this._items.get(id);
    if (item) {
      return item.expires >= Date.now();
    }
    return false;
  }

  /**
   * Has attempts
   * @param {String} id
   * @return {Boolean}
   */
  hasAttempts(id) {
    const item = this._items.get(id);
    if (item) {
      return item.expires >= Date.now() && item.attempts > 0;
    }
    return false;
  }

  /**
   * Check code for id
   * @param {String} id
   * @param {String} code
   * @return {Boolean} correct
   */
  check(id, code) {
    const item = this._items.get(id);
    if (item && item.expires >= Date.now() && item.attempts > 0) {
      if (compare(code, item.code)) {
        this._items.delete(id);
        return true;
      }
      this._items.set(id, {...item, attempts: item.attempts - 1});
    }
    return false;
  }
}
