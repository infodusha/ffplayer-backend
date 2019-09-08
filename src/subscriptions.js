import {createContext} from './context.js';

/**
 * Runs when user subscribes
 * @param {any} params
 * @param {any} socket
 * @return {any} socket context
 */
function onConnect(params, {upgradeReq}) {
  const {headers, socket} = upgradeReq;
  const ip = headers['x-real-ip'] || socket.remoteAddress;
  const authorization = headers.authorization;
  return createContext(ip, authorization);
}

export default {
  onConnect,
};
