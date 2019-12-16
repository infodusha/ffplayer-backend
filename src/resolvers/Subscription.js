import {withFilter} from '../modules/apollo.js';
import {statusPubSub, CHANGED_STATUS} from '../services/status.js';

export const Subscription = {
  Subscription: {
    changedStatus: {
      subscribe: withFilter(() => statusPubSub.asyncIterator(CHANGED_STATUS),
          (payload, variables) => {
            return variables.ids.includes(payload.changedStatus.id);
          },
      ),
    },
  },
};
