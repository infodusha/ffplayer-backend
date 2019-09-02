

/**
 * Runs when user subscribes
 * @param {any} params
 * @param {any} socket
 * @return {any} socket context
 */
function onConnect(params, socket) {
  const ip = socket.upgradeReq.socket.remoteAddress;
  const token = connectionParams.token;
  // TODO: decode & test token
  return {ip, token};
}

export default {
  onConnect,

};
