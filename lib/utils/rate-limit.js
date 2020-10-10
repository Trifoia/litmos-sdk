'use strict';

/*eslint-disable no-unused-vars*/
const LitmosOpts = require('../helpers/litmos-opts.js');
/*eslint-enable no-unused-vars*/

const wait = require('./wait.js');

/**
 * handles rate limiting by pausing operation until the current time has passed the provided
 * last request time plus the configured rate limit
 * 
 * @param {number} lastRequestTime Time the last request was sent out
 * @param {LitmosOpts} litmosOpts Litmos options
 * 
 * @returns {number} The current time
 */
const rateLimit = async (lastRequestTime, litmosOpts) => {
  if (!litmosOpts.rateLimit) return Date.now();
  const timeBetweenRequests = 60000 / litmosOpts.rateLimit;

  const now = Date.now();
  const timeDelta = now - lastRequestTime;
  if (timeDelta < timeBetweenRequests) {
    // We need to wait for our next chance. First set the new last request time to the
    // moment we expect to perform this request
    const waitTime = timeBetweenRequests - timeDelta;
    if (litmosOpts.verbose) {
      const currentTime = (new Date(now)).toISOString().split('T')[1];
      const untilTime = (new Date(now + waitTime)).toISOString().split('T')[1];
      console.log(`Rate Limited. Performing next request in ${waitTime}ms. Current time: ${currentTime}. Waiting until ${untilTime}`);
    }
    await wait(waitTime);
  }

  return Date.now();
};

module.exports = rateLimit;
