import {hash, compare, sign, verify} from './auth.js';

describe('Auth service', () => {
  it('Hash & compare values', () => {
    expect(compare('test', hash('test'))).toBe(true);
  });

  it('Hash & not compare different values', () => {
    expect(compare('different', hash('test'))).toBe(false);
  });

  it('Sign & verify data', () => sign({})
      .then((token) => verify(token))
      .then((data) => expect(data).toBeTruthy()));
});
