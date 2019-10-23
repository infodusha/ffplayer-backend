import {getUser} from '../providers/Review.js';

export default {
  Trainer: {
    user({id}) {
      return getUser(id);
    },
  },
};
