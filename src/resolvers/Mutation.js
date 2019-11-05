import {validate} from '../services/validation.js';
import {postCode} from '../providers/code.js';

export default {
  Mutation: {
    code(_, {email}, {ip}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return postCode(email);
    },
  },
};
