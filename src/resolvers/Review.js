import {getClient} from '../providers/client.js';

export const Review = {
  Review: {
    user({id}) {
      return getClient(id);
    },
  },
};
