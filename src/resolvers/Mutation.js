import {validate} from '../services/validation.js';
import {postCode} from '../providers/code.js';
import {ApolloError} from '../services/error.js';
import {updateSelf} from '../providers/Mutation.js';

export default {
  Mutation: {
    code(_, {email}, {ip}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return postCode(email.toLowerCase());
    },
    self(_, {pic = null, name = null, email = null}, {user}) {
      if (pic === null && name === null && email === null) {
        throw new ApolloError('Provide any changes');
      }
      if (email !== null) {
        validate((validator) => {
          validator().string().includes('@').check(email);
        });
      }
      return updateSelf(user.id, pic, name, email.toLowerCase());
    },
  },
};
