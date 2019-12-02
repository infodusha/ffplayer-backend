import apollo from 'apollo-server-express';

export const CHANGED_STATUS = 'CHANGED_STATUS';
export const statusPubSub = new apollo.PubSub();
const online = new Set();

/**
 * Set user status
 * @param {Number} id
 * @param {Boolean} isOnline
 */
export function setStatus(id, isOnline) {
  if (isOnline) {
    online.add(id);
  } else {
    online.delete(id);
  }
  statusPubSub.publish(CHANGED_STATUS, {changedStatus: {id, online: isOnline}});
}

/**
 * Check if user is online
 * @param {Number} id
 * @return {Boolean}
 */
export function isOnline(id) {
  return online.has(id);
}
