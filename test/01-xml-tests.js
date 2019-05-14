'use strict';

const assert = require('assert');

/**
 * XML Class is imported in testing
 */
let XML;

/**
 * Testing assets
 */
const assets = require('./assets/xml-test-assets.json');

describe('xml.js:', function() {
  it('should instantiate without errors', function() {
    XML = require('../lib/utils/xml.js');
  });

  it('should be able to process xml string for a list of users', function() {
    const out = XML.toJS(assets.usersXml.in, ['Users', 'User']);
    assert.deepStrictEqual(out, assets.usersXml.out);
  });

  it('should be able to clean a dirty object', function() {
    const dirty = XML.toJS(assets.usersXml.in, ['Users', 'User'], false);
    const clean = XML.toJS(dirty);
    assert.deepStrictEqual(clean, assets.usersXml.out);
  });

  it('should be able to convert js to xml', function() {
    // First convert XML to a JS object
    const out = XML.toJS(assets.usersXml.in, ['Users', 'User']);
    assert.deepStrictEqual(out, assets.usersXml.out);

    // Now make it XML again
    const outXML = XML.toXML(out);
    assert.equal(outXML, assets.usersXml.xmlOut);
  });
});
