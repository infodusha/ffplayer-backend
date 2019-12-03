import {createContext} from './context.js';
import {setOnline, setOffline} from './services/status.js';

export const subscriptions = {
  onConnect(_, {upgradeReq}) {
    const {headers, socket} = upgradeReq;
    const ip = headers['x-real-ip'] || socket.remoteAddress;
    const authorization = headers.authorization;
    const context = createContext(ip, authorization);
    if (context.user) {
      setOnline(context.user.id);
    }
    return context;
  },
  onDisconnect(_, context) {
    if (context.user) {
      setOffline(context.user.id, false);
    }
  },
};
