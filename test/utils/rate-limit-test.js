'use strict';

const assert = require('assert');

const itSlowly = require('../test-utils/it-slowly.js');

const {litmosOpts} = require('../../config.js');

const rateLimit = require('../../lib/utils/rate-limit.js');

const timeBetweenRequests = 60000 / litmosOpts.rateLimit;

describe('rate-limit', function() {
  itSlowly('should wait one rate limit period', async () => {
    const startTime = Date.now();
    await rateLimit(startTime, litmosOpts);

    const endTime = Date.now();
    assert.ok(Math.abs(endTime - (startTime + timeBetweenRequests)) < 10);
  });

  itSlowly('should wait half of one rate limit period', async () => {
    const startTime = Date.now();
    await rateLimit(startTime - timeBetweenRequests / 2, litmosOpts);

    const endTime = Date.now();
    assert.ok(Math.abs(endTime - (startTime + timeBetweenRequests / 2)) < 10);
  });

  it('should wait no seconds', async () => {
    const startTime = Date.now();
    await rateLimit(startTime - timeBetweenRequests, litmosOpts);

    const endTime = Date.now();
    assert.ok(Math.abs(endTime - startTime) < 50);
  });
});
