import {createContext} from './context.js';
import {setStatus} from './services/status.js';

export const subscriptions = {
  onConnect(_, {upgradeReq}) {
    const {headers, socket} = upgradeReq;
    const ip = headers['x-real-ip'] || socket.remoteAddress;
    const authorization = headers.authorization;
    const context = createContext(ip, authorization);
    if (context.user) {
      setStatus(context.user.id, true);
    }
    return context;
  },
  onDisconnect(_, context) {
    if (context.user) {
      setStatus(context.user.id, false);
    }
  },
};
