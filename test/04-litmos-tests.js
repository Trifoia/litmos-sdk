'use strict';

const Litmos = require('../litmos.js');
const LitmosOpts = require('../lib/litmos-opts.js');

const assert = require('assert');
const lodash = require('lodash');

const assetsRaw = [
  [require('./assets/users-get-asset-raw.json')],
  [
    require('./assets/users-get-paginated-asset-raw-01.json'),
    require('./assets/users-get-paginated-asset-raw-02.json'),
    require('./assets/users-get-paginated-asset-raw-03.json')
  ],
  [require('./assets/users-search-asset-raw.json')],
  [require('./assets/learningpaths-get-asset-raw.json')],
  [require('./assets/users-id-get-asset-raw.json')],
  [require('./assets/users-id-learningpaths-get-raw.json')],
  [require('./assets/users-id-learningpaths-post-raw.json')],
  [require('./assets/users-post-raw.json')]
];
const assetsProcessed = [
  require('./assets/users-get-asset-processed.json'),
  require('./assets/users-get-paginated-asset-processed.json'),
  require('./assets/users-search-asset-processed.json'),
  require('./assets/learningpaths-get-asset-processed.json'),
  require('./assets/users-id-get-asset-processed.json'),
  require('./assets/users-id-learningpaths-get-processed.json'),
  require('./assets/users-id-learningpaths-post-processed.json'),
  require('./assets/users-post-processed.json')
];

let litmos = null;

/**
 * The original request._req method is saved so it can be restored after proxy
 */
let originalReq = null;

/**
 * Special counter used to determine what test we are on when proxying responses
 */
let currentTest = 0;

/**
 * Handles proxying the _req method so that we don't actually send any requests
 */
const proxyHandler = {
  apply: async function(target, thisArg, args) {
    // Break down the raw assets depending on the current test
    const currentAssetsRaw = assetsRaw[currentTest];

    // Try to find the provided options among the raw assets
    const foundAsset = currentAssetsRaw.find((obj) => lodash.isEqual(obj.opts, args[0]));
    if (!foundAsset) {
      console.error(args);
      throw new Error('Could not find matching response data!');
    }
    args[1].call(null, null, foundAsset.res);
  }
};

/**
 * Unit tests for the main Litmos SDK
 */
describe('litmos.js', function() {
  beforeEach(function() {
    // Proxy the _req function so that we don't actually send requests
    if (!litmos) return;
    if (!originalReq) originalReq = litmos._request._req;
    litmos._request._req = new Proxy(litmos._request._req, proxyHandler);
  });

  describe('instantiation', () => {
    it('should be able to instantiate without errors', () => {
      const litmosOpts = {
        apiKey: 'SECRET',
        source: 'SECRET'
      };
      litmos = new Litmos(litmosOpts);

      assert.deepStrictEqual(litmos.opts, new LitmosOpts(litmosOpts));
    });
  });

  describe('users/', () => {
    it('should be able to GET a simple list of users', async () => {
      currentTest = 0;
      const res = await litmos.users.get();
      assert.deepStrictEqual(res, assetsProcessed[currentTest]);
    });
    it('should be able to GET a paginated list of users', async () => {
      currentTest = 1;
      const res = await litmos.users.get();

      // The test objects for this are massive, validating length should be sufficient
      assert.strictEqual(res.length, assetsProcessed[currentTest].length);
    });
    it('should be able to search for a user', async () => {
      currentTest = 2;
      const res = await litmos.users.search('test0@email.com');
      assert.deepStrictEqual(res, assetsProcessed[currentTest]);
    });
    it('should be able to POST a new user', async () => {
      currentTest = 7;
      const newUser = litmos.helpers.generateUserObject({
        UserName: 'test0@email.com',
        FirstName: 'Joshua',
        LastName: 'Evans',
        DisableMessages: true
      });
      const res = await litmos.users.post(newUser);
      assert.deepStrictEqual(res, assetsProcessed[currentTest]);
    });
    describe('{id}/', () => {
      it('should be able to GET a specific user', async () => {
        currentTest = 4;
        const res = await litmos.users.id('w8_XWWRCq7S5xPc4LdjqMw2').get();
        assert.deepStrictEqual(res, assetsProcessed[currentTest]);
      });

      describe('learningpaths/', () => {
        it('should be able to GET a user\'s learning paths', async () => {
          currentTest = 5;
          const res = await litmos.users.id('LePcvst-OlRc4zjvEljB6A2').learningpaths.get();
          assert.deepStrictEqual(res, assetsProcessed[currentTest]);
        });
        it('should be able to POST a new learning path to a user', async () => {
          currentTest = 6;
          const res = await litmos.users.id('LePcvst-OlRc4zjvEljB6A2').learningpaths.post({Id: 'TY06ocOKyzM1'});
          assert.deepStrictEqual(res, assetsProcessed[currentTest]);
        });
      });
    });
  });

  describe('learningpaths/', () => {
    it('should be able to GET a list of learning paths', async () => {
      currentTest = 3;
      const res = await litmos.learningpaths.get();
      assert.deepStrictEqual(res, assetsProcessed[currentTest]);
    });
  });

  after(function() {
    // Restore the request function
    litmos._request._req = originalReq;
  });
});
