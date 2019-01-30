'use strict';

const assert = require('assert');

const helpers = require('../lib/litmos-helpers.js');
const xml = require('../lib/xml.js');

/**
 * Tests for the `litmos-helpers` module
 */
describe('litmos-helpers.js', function() {
  describe('generateUserObject', () => {
    const userSeed = {
      UserName: 'some@email.com',
      FirstName: 'First',
      LastName: 'Last',
      DisableMessages: false
    };
    const userXml = '<Id></Id><UserName>some@email.com</UserName><FirstName>First</FirstName><LastName>Last</LastName><FullName></FullName><Email>some@email.com</Email><AccessLevel>Learner</AccessLevel><DisableMessages>false</DisableMessages><Active>true</Active><LastLogin></LastLogin><LoginKey></LoginKey><IsCustomUsername>false</IsCustomUsername><SkipFirstLogin>false</SkipFirstLogin><TimeZone></TimeZone>';
    it('method should exist', () => {
      assert.ok(helpers.generateUserObject);
    });
    it('should fail with inadequate data', () => {
      try {
        helpers.generateUserObject({});
      } catch (e) {
        assert.strictEqual(e.message, 'Missing required elements for User creation: UserName, FirstName, LastName, DisableMessages');
      }
    });
    it('should succeed with minimal data', () => {
      const newUser = helpers.generateUserObject(userSeed);

      assert.strictEqual(newUser.UserName, userSeed.UserName);
      assert.strictEqual(newUser.FirstName, userSeed.FirstName);
      assert.strictEqual(newUser.LastName, userSeed.LastName);
      assert.strictEqual(newUser.DisableMessages, userSeed.DisableMessages);
    });
    it('should correctly convert to XML', () => {
      const newUser = helpers.generateUserObject(userSeed);

      assert.strictEqual(xml.toXML(newUser), userXml);
    });
    it('should correctly convert to XML when seed object is out of order', () => {
      const newUser = helpers.generateUserObject({
        DisableMessages: false,
        LastName: 'Last',
        FirstName: 'First',
        UserName: 'some@email.com'
      });

      assert.strictEqual(xml.toXML(newUser), userXml);
    });
  });
});
