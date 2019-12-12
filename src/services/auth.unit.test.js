import {hash, compare, sign, verify} from './auth.js';

describe('Auth service', () => {
  it('Hash & compare values', () => {
    expect(compare('test', hash('test'))).toBe(true);
  });

  it('Hash & not compare different values', () => {
    expect(compare('different', hash('test'))).toBe(false);
  });

  it('Sign & verify data', () => expect(sign({}).then(verify))
      .resolves.not.toThrow());

  it('Throws when sign data is wrong typed', () => expect(sign(1))
      .rejects.toThrow());
});
