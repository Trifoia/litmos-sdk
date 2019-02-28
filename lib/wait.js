'use strict';
/**
 * Async wrapper for setTimeout that will pause operations for the provided number of milliseconds
 *
 * @param {number} ms Milliseconds to wait for
 */
module.exports = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
};
