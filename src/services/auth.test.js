import {hash, compare, sign, configure} from './auth.js';

beforeAll(() => {
  return configure({key: '../ssl/cert.key'});
});

test('Hash works', () => {
  expect(compare('test', hash('test'))).toBe(true);
});

test('Hash not compare different values', () => {
  expect(compare('different', hash('test'))).toBe(false);
});

test('Sign works', () => expect(sign({})).resolves.not.toThrow());
