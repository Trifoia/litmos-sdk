'use strict';

const config = require('./config.js');

const LitmosOpts = require('./lib/helpers/litmos-opts.js');
const Request = require('./lib/request/request.js');

const users = require('./lib/endpoints/users.js');
const courses = require('./lib/endpoints/courses.js');
const results = require('./lib/endpoints/results.js');
const teams = require('./lib/endpoints/teams.js');
const learningpaths = require('./lib/endpoints/learningpaths.js');

const generateModuleResult = require('./lib/generators/generate-module-result.js');
const generateUser = require('./lib/generators/generate-user.js');

/**
 * The Litmos class is the main entry-point or Litmos SDK operations
 */
class Litmos {
  /**
   * Constructor takes Litmos Options for initialization. See the LitmosOpts class for
   * details. A raw object can also be provided to be instantiated as a LitmosOpts instance,
   * and an error will be thrown if the provided options are invalid
   *
   * @param {LitmosOpts} opts Options to initialize the litmos SDK with
   */
  constructor(opts) {
    // Check to see if these options have already been constructed
    if (!(opts instanceof LitmosOpts)) opts = new LitmosOpts(opts);

    // Initialize configuration
    config.loadConfig({litmosOpts: opts});

    /**
     * @private
     * Internal object used to make requests to the Litmos API
     */
    this._request = new Request();

    /**
     * Starting point for api access
     */
    this.api = {
      /**
       * Access to user data
       */
      users: users(this._request),

      /**
       * Access to course data
       */
      courses: courses(this._request),

      /**
       * Access to result data
       */
      results: results(this._request),

      /**
       * Access to team data
       */
      teams: teams(this._request),

      /**
       * Access to learning path data
       */
      learningpaths: learningpaths(this._request)
    };
  }

  /**
   * Helper function takes an array representing a final endpoint and attempts to return the
   * full api object that can be used to access that endpoint. Any unknown values in the array
   * will be assumed to be ids
   *
   * Will throw an error if the endpoint is invalid
   *
   * @param {string[]} endpointArr Array of endpoint values
   *
   * @return {object} The final endpoint object that can be used to access the Litmos API
   */
  setEndpoint(endpointArr) {
    let finalObject = this.api;

    for (let i=0; i<endpointArr.length; i++) {
      const item = endpointArr[i];

      if (finalObject[item]) {
        // This is a valid endpoint that we recognize
        finalObject = finalObject[item];
        continue;
      }

      // This isn't a known endpoint value. Could it be an id?
      if (finalObject.id) {
        // It could be an ID!
        finalObject = finalObject.id(item);
        continue;
      }

      // It's not an ID. This is an invalid endpoint
      throw new Error(`Invalid Endpoint used in setEndpoint: ${endpointArr.join('/')}`);
    }

    return finalObject;
  }

  /**
   * Helpers that assist in working with the Litmos API
   */
  get helpers() {
    return {
      generateModuleResult,
      generateUser,
      generateModuleResultObject: generateModuleResult, // Backwards compatibility
      generateUserObject: generateUser // Backwards compatibility
    };
  }

  /**
   * The total number of API calls made to the Litmos API. Note that a single request can use
   * multiple API calls if pagination was required
   */
  get requestCount() {
    return this._request.requestCount;
  }
}

module.exports = Litmos;
