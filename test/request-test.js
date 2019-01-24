'use strict';

const assert = require('assert');
const lodash = require('lodash');

const assets = require('./assets/request-test-assets.json');
// const env = require('../.env.json');
const Request = require('../lib/utils/request.js');
const LitmosOpts = require('../lib/utils/litmos-opts.js');

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
    const ret = assets.requestData.find((data) => lodash.isEqual(data.opts, args[0]));
    if (!ret) throw new Error('No Proxy Options found');
    args[1].call(null, null, ret.res);
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
    request = new Request(opts);

    // Verify that options are set correctly
    const litmosOpts = new LitmosOpts(opts);
    assert.deepStrictEqual(litmosOpts, request.options);
  });

  it('should be able to get a list of users', async function() {
    const val = await request.api('/users', 'GET', null, ['Users', 'User']);
    assert.ok(lodash.isEqual(val, assets.usersOut));
  });

  it('should be able to get a list of users with pagination', async function() {

  });

  after(function() {
    // Restore the request function
    request._req = originalReq;
  });
});
