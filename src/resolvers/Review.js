import {getClient} from '../providers/client.js';

export default {
  Review: {
    user({id}) {
      return getClient(id);
    },
  },
};
