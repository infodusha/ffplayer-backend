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
    for (const [email, {expires}] of this._items.entries()) {
      if (expires <= now) {
        this._items.delete(email);
      }
    }
    setTimeout(this._cleaner.bind(this), this._lifetime);
  }

  /**
   * Add email
   * @param {String} email
   * @return {Promise<String>} code
   */
  async add(email) {
    const code = await generate();
    const codeHash = hash(code);
    this._items.set(email, {
      code: codeHash,
      expires: Date.now() + this._lifetime,
      attempts: this._attempts,
    });
    return code;
  }

  /**
   * Has email
   * @param {String} email
   * @return {Boolean}
   */
  has(email) {
    const item = this._items.get(email);
    if (item) {
      return item.expires >= Date.now();
    }
    return false;
  }

  /**
   * Has attempts
   * @param {String} email
   * @return {Boolean}
   */
  hasAttempts(email) {
    const item = this._items.get(email);
    if (item) {
      return item.expires >= Date.now() && item.attempts > 0;
    }
    return false;
  }

  /**
   * Check code for email
   * @param {String} email
   * @param {String} code
   */
  async check(email, code) {
    const item = this._items.get(email);
    if (item && item.expires >= Date.now() && item.attempts > 0) {
      if (compare(code, item.code)) {
        this._items.delete(email);
        return true;
      }
      this._items.set(email, {...item, attempts: item.attempts - 1});
    }
    return false;
  }
}
