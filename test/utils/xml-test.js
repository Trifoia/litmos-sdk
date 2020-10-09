'use strict';

const assert = require('assert');

const assets = require('../assets/xml-test-assets.json');

const xml = require('../../lib/utils/xml.js');

describe('xml', function() {
  it('should be able to process xml string for a list of users', function() {
    const out = xml.toJS(assets.usersXml.in, ['Users', 'User']);
    assert.deepStrictEqual(out, assets.usersXml.out);
  });

  it('should be able to clean a dirty object', function() {
    const dirty = xml.toJS(assets.usersXml.in, ['Users', 'User'], false);
    const clean = xml.toJS(dirty);
    assert.deepStrictEqual(clean, assets.usersXml.out);
  });

  it('should be able to convert js to xml', function() {
    // First convert xml to a JS object
    const out = xml.toJS(assets.usersXml.in, ['Users', 'User']);
    assert.deepStrictEqual(out, assets.usersXml.out);

    // Now make it XML again
    const outXML = xml.toXML(out);
    assert.strictEqual(outXML, assets.usersXml.xmlOut);
  });

  it('should automatically parse JSON', async () => {
    const inJson = JSON.stringify({Users:[{User: { FirstName: 'Test'}}]});
    const outXml = xml.toXML(inJson);

    assert.strictEqual(outXml, '<Users><User><FirstName>Test</FirstName></User></Users>');
  });

  it('should return xml string unchanged', async () => {
    const inXml = '<Users><User><FirstName>Test</FirstName></User></Users>';
    const outXml = xml.toXML(inXml);

    assert.strictEqual(inXml, outXml);
  });
});
