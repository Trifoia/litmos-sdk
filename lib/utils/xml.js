'use strict';

const lodash = require('lodash');
const xmlConvert = require('xml-js');

/**
 * Static helpers assist with processing data to and from XML. This class should only be
 * used internally
 */
const XML = {
  /**
   * Cleans objects by fixing artifacts left over in the conversion from XML to a JS Object.
   * This method does not alter the provided data object
   * 
   * @param {object} data Object generated from XML
   * 
   * @returns {object} New cleaned object
   */
  cleanData: (data) => {
    data = lodash.cloneDeep(data);
    lodash.forEach(data, (value, key) => {
      if (!value) return;
  
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
      if (lodash.isObject(value) && !lodash.isEmpty(value)) data[key] = XML.cleanData(value);
  
      // Replace any empty objects with null
      if (lodash.isEmpty(value)) data[key] = null;
    });
  
    return data;
  },

  /**
   * Simple xmlConverter wrapper converts a JS object to an XML String representation. Will
   * automatically parse JSON passed to it
   *
   * @param {Object} js JavaScript Object
   *
   * @return {String} XML String representation of the JS object
   */
  toXML: (js) => {
    if (typeof js === 'string') {
      try {
        js = JSON.parse(js);
      } catch(e) {
        // This is not a JSON string, return it
        return js;
      }
    }
    return xmlConvert.js2xml(js, {compact: true, fullTagEmptyElement: true});
  },

  /**
   * Takes a response from the Litmos API, converts it to JSON, and (optionally) removes left
   * over XML artifacts. If provided with a non-string then it will attempt to clean the
   * object given. If given an object and the `clean` parameter is set to false, the same
   * exact object wil be returned
   *
   * @param {(String|Object)} body XML response body from the Litmos API OR a previously
   *                               processed body that needs to be cleaned
   * @param {string[]} path XML bodies returned from Litmos have complex paths that are
   *                        different depending on the endpoint - this path must be given for
   *                        proper xml processing. Must be an array of string values
   * @param {boolean} [clean=true] If the response should be cleaned up
   *
   * @return {object|object[]} Processed response. Will always return an array when `clean` is
   *                           set to true
   */
  toJS: (body, path = [], clean = true) => {
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

    res = XML.cleanData(res);

    // Filter out any empty objects
    res = res.filter((value) => !lodash.isEmpty(value));

    return res;
  }
};

module.exports = XML;
