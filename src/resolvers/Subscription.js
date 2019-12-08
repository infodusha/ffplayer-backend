import apollo from 'apollo-server-express';
import {statusPubSub, CHANGED_STATUS} from '../services/status.js';

export const Subscription = {
  Subscription: {
    changedStatus: {
      subscribe: apollo.withFilter(() => statusPubSub.asyncIterator(CHANGED_STATUS),
          (payload, variables) => {
            return variables.ids.includes(payload.changedStatus.id);
          },
      ),
    },
  },
};
