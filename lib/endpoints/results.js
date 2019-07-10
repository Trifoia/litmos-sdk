'use strict';

/*
  The `valid-jsdoc` rule has to be ignored so that IntelliSense documentation can properly chain past the "id" methods.
  If the `@return` value is defined for these methods the documentation chain breaks
*/
/* eslint-disable valid-jsdoc */

const get = require('../request/get.js');
const put = require('../request/put.js');
const helpers = require('../helpers/litmos-helpers.js');

// Endpoints to Support:
// /results    - NA
//   /details    - get
//   /modules    - NA
//     /{moduleId} - put

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  /**
   * Starting point for the 'results' API paths
   */
  const results = {
    /**
     * Access to historic result details
     */
    details: {
      _endpoint: ['results', 'details'],
      _resPath: ['Users', 'User'],
      _request: request,

      /**
       * GET all user results since a date defined in a `since` query parameter. If this parameter is not present
       * the get request will fail and no data will be returned
       *
       * Note: This endpoint can take a very long time to resolve. It seems to be hard on Litmos' servers
       *
       * @param {object} params Query parameters. Must include a `since` parameter
       *
       * @return {Promise} Promise will resolve with an array of user result objects
       */
      get
    },

    /**
     * Access to module result posting
     */
    modules: {
      /**
       * Identifies what module a result will be applied to
       *
       * @param {string} moduleId The Litmos ID of the module
       */
      id: function(moduleId) {
        return {
          _endpoint: ['results', 'modules', moduleId],
          _resPath: [],
          _reqPath: ['ModuleResult'],
          _request: request,

          /**
           * PUT result data for a specific module
           *
           * @param {object} body JS Object body for the put request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          put: function(body, params) {
            // Make sure data is in the correct format
            body = helpers.generateModuleResultObject(body);
            return put.call(this, [body, params]);
          }
        };
      }
    }
  };

  return results;
};

module.exports = generator;
