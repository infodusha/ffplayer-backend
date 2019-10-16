import {postCode} from '../providers/code.js';

export default {
  Mutation: {
    code(parent, {email}, {ip}) {
      return postCode(email);
    },
  },
};
