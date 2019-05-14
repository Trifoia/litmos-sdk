'use strict';

const LitmosOpts = require('./lib/helpers/litmos-opts.js');
const Request = require('./lib/request/request.js');

const users = require('./lib/endpoints/users.js');
const courses = require('./lib/endpoints/courses.js');
const results = require('./lib/endpoints/results.js');
const teams = require('./lib/endpoints/teams.js');
const learningpaths = require('./lib/endpoints/learningpaths.js');

const helpers = require('./lib/helpers/litmos-helpers.js');

/**
 * The Litmos class is the main entry-point or Litmos SDK operations
 */
class Litmos {
  /**
   * Constructor takes Litmos Options for initialization. See the LitmosOpts class for details. A raw object can also
   * be provided to be instantiated as a LitmosOpts instance, and an error will be thrown if the provided
   * options are invalid
   *
   * @param {LitmosOpts} opts Options to initialize the litmos SDK with
   */
  constructor(opts) {
    // Check to see if these options have already been constructed
    if (opts instanceof LitmosOpts) {
      this.opts = opts;
    } else {
      this.opts = new LitmosOpts(opts);
    }

    /**
     * @private
     * Internal object used to make requests to the Litmos API
     */
    this._request = new Request(this.opts);

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
   * Helpers that assist in working with the Litmos API
   */
  get helpers() {
    return helpers;
  }

  /**
   * The total number of API calls made to the Litmos API. Note that sometimes a single request can use
   * multiple API calls if pagination was required
   */
  get requestCount() {
    return this._request.requestCount;
  }
}

module.exports = Litmos;
