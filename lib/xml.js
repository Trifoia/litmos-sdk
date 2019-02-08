'use strict';

const lodash = require('lodash');
const xmlConvert = require('xml-js');

const cleanData = (data) => {
  lodash.forEach(data, (value, key) => {
    // Extract text and apply it to the key directly
    if (value._text) {
      data[key] = value._text;
      return;
    }

    // Remove null values
    // Null values look like this in xml
    //   <key 'i:nill':'true'></key>
    if (value._attributes && value._attributes['i:nil'] === 'true') {
      data[key] = null;
      return;
    }

    // Remove attributes
    if (value._attributes) delete value._attributes;

    // If this data element is a non-null object, recurse deeper
    if (lodash.isObject(value) && !lodash.isEmpty(value)) value = cleanData(value);
  });

  return data;
};

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
    return xmlConvert.js2xml(js, {compact: true, fullTagEmptyElement: true});
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
   *                        values
   * @param {boolean} [clean=true] If the response should be cleaned up
   *
   * @return {object|object[]} Processed response. If given an object to clean, the returned object will be new
   */
  static toJS(body, path = [], clean = true) {
    // Convert into JSON
    let res;
    if (lodash.isString(body)) {
      res = xmlConvert.xml2js(body, {compact: true});
    } else {
      res = lodash.cloneDeep(body);
    }

    // Use the provided path
    path.forEach((p) => {
      if (res[p]) res = res[p];
    });

    // Only clean if we were asked to
    if (!clean) return res;

    // Make sure the body is an array
    if (!lodash.isArray(res)) res = [res];

    res = cleanData(res);

    // Filter out any empty objects
    res = res.filter((value) => !lodash.isEmpty(value));

    return res;
  }
}

module.exports = XML;
