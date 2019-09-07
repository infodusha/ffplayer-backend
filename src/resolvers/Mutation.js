import {codeFor} from '../providers/token.js';

export default {
  Mutation: {
    code(parent, {email}, {ip}) {
      return codeFor(email);
    },
  },
};
