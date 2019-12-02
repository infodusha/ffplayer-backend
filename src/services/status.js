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
}

/**
 * Check if user is online
 * @param {Number} id
 * @return {Boolean}
 */
export function isOnline(id) {
  return online.has(id);
}
