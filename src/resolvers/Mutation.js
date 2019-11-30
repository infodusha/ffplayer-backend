import {validate} from '../services/validation.js';
import {postCode} from '../providers/code.js';
import {ApolloError} from '../services/error.js';
import {updateSelf, postEmailCode, updateEmail} from '../providers/Mutation.js';

export default {
  Mutation: {
    code(_, {email}, {ip}) {
      validate((validator) => {
        validator().string().includes('@').check(email);
      });
      return postCode(email.toLowerCase());
    },
    self(_, {pic = null, name = null}, {user}) {
      if (pic === null && name === null) {
        throw new ApolloError('Provide any changes');
      }
      return updateSelf(user.id, pic, name);
    },
    selfEmailCode(_, {oldEmail, newEmail}, {user}) {
      validate((validator) => {
        validator().string().includes('@').check(oldEmail);
        validator().string().includes('@').check(newEmail);
      });
      return postEmailCode(user.id, oldEmail.toLowerCase(), newEmail.toLowerCase());
    },
    selfEmail(_, {oldEmail, newEmail, oldCode, newCode}, {user}) {
      validate((validator) => {
        validator().string().includes('@').check(oldEmail);
        validator().string().includes('@').check(newEmail);
      });
      return updateEmail(user.id, oldEmail.toLowerCase(), newEmail.toLowerCase(), oldCode.toUpperCase(), newCode.toUpperCase());
    },
  },
};
