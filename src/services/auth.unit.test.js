import {hash, compare, sign} from './auth.js';

test('Hash works', () => {
  expect(compare('test', hash('test'))).toBeTruthy();
});

test('Hash not compare different values', () => {
  expect(compare('different', hash('test'))).toBeFalsy();
});

test('Sign works', () => expect(sign({})).resolves.not.toThrow());
