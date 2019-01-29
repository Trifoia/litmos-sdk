'use strict';

const lodash = require('lodash');
const xmlConvert = require('xml-js');

/**
 * Static helper class assists with processing data to and from XML. This class should only be used internally
 */
class XML {
  /**
   * Simple xmlConverter wrapper converts a JS object to an XML String representation
   *
   * @param {Object} js JavaScript Object
   *
   * @return {String} XML String representation of the JS object
   */
  static toXML(js) {
    return xmlConvert.js2xml(js, {compact: true});
  }

  /**
   * Takes a response from the Litmos API, converts it to JSON, and (optionally) removes left over XML artifacts. If
   * provided with a non-string then it will attempt to clean the object given. If given an object and the `clean`
   * parameter is set to false, the same exact object wil be returned
   *
   * @param {(String|Object)} body XML response body from the Litmos API OR a previously processed body that needs to
   *                              be cleaned
   * @param {string[]} path XML bodies returned from Litmos have complex paths that are different depending on
   *                        the endpoint - this path must be given for proper xml processing. Must be an array of string
   *                        values. This value is no used if the `clean` flag is set to false
   * @param {boolean} [clean=true] If the response should be cleaned up
   *
   * @return {Object} Processed response. If given an object to clean, the returned object will be new
   */
  static toJS(body, path = [], clean = true) {
    // Convert into JSON
    let res;
    if (lodash.isString(body)) {
      res = xmlConvert.xml2js(body, {compact: true});
    } else {
      res = lodash.cloneDeep(body);
    }

    // Allow an array for the path argument
    path = lodash.flatten(path);

    // Use the provided path
    path.forEach((p) => {
      if (res[p]) res = res[p];
    });

    // Only clean if we were asked to
    if (!clean) return res;

    // Make sure the body is an array
    if (!lodash.isArray(res)) res = [res];

    res.forEach((bodyValue, bodyIndex) => {
      lodash.forEach(bodyValue, (value, key) => {
        /*
        Original xml if there is a `_text` element:
          <key>_text</key>

        This should equate to this json:
          {
            key: '_text'
          }
        */
        if (value._text) {
          res[bodyIndex][key] = value._text;
          return;
        }

        /*
        `{ _attributes: { 'i:nil': 'true' }` original xml:
          <key 'i:nill':'true'></key>

        Should translate to:
          {
            key: null
          }
        */
        if (value._attributes && value._attributes['i:nil'] === 'true') {
          res[bodyIndex][key] = null;
          return;
        }
      });
    });

    return res;
  }
}

module.exports = XML;
