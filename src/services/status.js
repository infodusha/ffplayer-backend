import apollo from 'apollo-server-express';

export const CHANGED_STATUS = 'CHANGED_STATUS';
export const statusPubSub = new apollo.PubSub();
const online = new Map();

/**
 * Set as online
 * @param {Number} id
 */
export function setOnline(id) {
  const connections = online.get(id) || 0;
  online.set(id, connections + 1);
  if (connections === 0) {
    statusPubSub.publish(CHANGED_STATUS, {changedStatus: {id, online: true}});
  }
}

/**
 * Set as offline
 * @param {Number} id
 */
export function setOffline(id) {
  const connections = online.get(id);
  if (connections === 1) {
    online.delete(id);
    statusPubSub.publish(CHANGED_STATUS, {changedStatus: {id, online: false}});
  } else {
    online.set(id, connections - 1);
  }
}

/**
 * Check if user is online
 * @param {Number} id
 * @return {Boolean}
 */
export function isOnline(id) {
  return online.has(id);
}
