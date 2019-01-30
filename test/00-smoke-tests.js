'use strict';

const assert = require('assert');

/**
 * These tests determine if something is critically and obviously broken before doing more
 * advanced testing
 */
describe('Smoke tests', function() {
  describe('Importing', () => {
    it('XML Helper import', () => {
      const XML = require('../lib/xml.js');
      assert.ok(XML);
    });
    it('Request helper import', () => {
      const Request = require('../lib/request.js');
      assert.ok(Request);
    });
    it('Litmos Options helper import', () => {
      const LitmosOpts = require('../lib/litmos-opts.js');
      assert.ok(LitmosOpts);
    });
    it('Generator helper import', () => {
      const Generators = require('../lib/generators.js');
      assert.ok(Generators);
    });
    it('Litmos helper import', () => {
      const litmosHelpers= require('../lib/litmos-helpers.js');
      assert.ok(litmosHelpers);
    });
    it('Litmos SDK import', () => {
      const Litmos = require('../litmos.js');
      assert.ok(Litmos);
    });
  });
});
