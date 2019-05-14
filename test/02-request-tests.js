'use strict';

const assert = require('assert');

const assetsRaw = require('./assets/users-get-asset-raw.json');
const assetsProcessed = require('./assets/users-get-asset-processed.json');
// const env = require('../.env.json');
const Request = require('../lib/request/request.js');
const LitmosOpts = require('../lib/helpers/litmos-opts.js');

/**
 * Request instance used for testing - instantiated as part of a test
 */
let request;

/**
 * The original request._req method is saved so it can be restored after proxy
 */
let originalReq;

/**
 * Handles proxying the _req method so that we don't actually send any requests
 */
const proxyHandler = {
  apply: async function(target, thisArg, args) {
    args[1].call(null, null, assetsRaw.res);
  }
};

describe('request.js:', function() {
  beforeEach(function() {
    if (typeof request !== 'undefined') {
      // Proxy the _req function so that we don't actually send requests
      originalReq = request._req;
      request._req = new Proxy(request._req, proxyHandler);
    }
  });

  it('should be able to instantiate without errors', function() {
    const opts = {
      apiKey: 'SECRET',
      source: 'SECRET'
    };
    request = new Request(new LitmosOpts(opts));

    // Verify that options are set correctly
    const litmosOpts = new LitmosOpts(opts);
    assert.deepStrictEqual(litmosOpts, request.options);
  });

  it('should be able to get a list of users', async function() {
    const opts = {
      endpoint: 'users',
      method: 'GET',
      path: ['Users', 'User']
    };
    const val = await request.api(opts);
    assert.deepStrictEqual(val, assetsProcessed);
  });

  after(function() {
    // Restore the request function
    request._req = originalReq;
  });
});
