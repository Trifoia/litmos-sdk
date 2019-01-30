'use strict';

const lodash = require('lodash');

const LitmosOpts = require('./lib/litmos-opts.js');
const Request = require('./lib/request.js');

const generators = require('./lib/generators.js');

// String constants
const LEARNINGPATHS = 'learningpaths';
const USERS = 'users';

// Paths
const PATHS = {};
PATHS[LEARNINGPATHS] = ['LearningPaths', 'LearningPath'];
PATHS[USERS] = ['Users', 'User'];

/**
 * The Litmos class is the main entry-point or Litmos SDK operations
 */
class Litmos {
  /**
   * @private
   * Used internally for method chaining
   * Adds a string to the endpoint array. Will throw an error if that string is already present, since circular
   * request paths are never used in Litmos
   *
   * @param {string} value String to add to the endpoint array
   */
  _addEndpoint(value) {
    if (this._endpoint.includes(value)) throw new Error(`Value: "${value}" already present in endpoint array`);
    this._endpoint.push(value);
  }

  /**
   * @private
   * Used internally to determine what object path data will be available under once returned form the API
   *
   * @param {string[]} endpointArr Array representation of the endpoint to query
   * @return {string[]} Path array of length 2
   */
  _determinePath(endpointArr) {
    // The path is determined by the last "known" endpoint string
    let path;

    // Go backwards through the endpoint array until we find a known path
    for (let i=endpointArr.length - 1; i>=0; i--) {
      const pathSegment = endpointArr[i];
      if (PATHS[pathSegment]) {
        // The path should be the plural path string, followed by the singular path string
        path = PATHS[pathSegment];
        break;
      }
    }

    // Check for unknown
    if (!path) {
      console.warn(`WARNING: Could not determine path for endpoint "${endpointArr.join('/')}"`);
    }

    return path;
  }

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
     * Internal array represents the currently chained endpoint. Should never be altered directly
     */
    this._endpoint = [];

    /**
     * @private
     * Internal object used to make request to the Litmos API
     */
    this._request = new Request(this.opts);

    /**
     * Base "users" endpoint access
     */
    this.users = {
      // Generate chainable functions
      id: generators.generateId(this, USERS),

      // Generate non-chainable functions
      get: generators.generateGet(this, USERS),
      search: generators.generateSearch(this, USERS),
      details: generators.generateDetails(this, USERS),
      post: generators.generatePost(this, USERS),

      // Attach valid sub-paths
      learningpaths: this.learningpaths
    };

    /**
     * Base "learningpaths" endpoint access
     */
    this.learningpaths = {
      // Generate chainable functions
      id: generators.generateId(this, LEARNINGPATHS),

      // Generate non-chainable functions
      get: generators.generateGet(this, LEARNINGPATHS),
      post: generators.generatePost(this, LEARNINGPATHS),

      // Attach valid sub-paths
      users: this.users
    };
  }

  /**
   * Creates a brand new Litmos SDK instance with the same settings as `this` instance - used for command chaining
   *
   * @return {Litmos} New Litmos SDK instance
   */
  clone() {
    const newInstance = new Litmos(this.opts);
    newInstance._endpoint = this._endpoint.slice();
    return newInstance;
  }

  /**
   * Performs a search operation with a specific term. This function must always come after a chain of path
   * identifiers - for example:
   * `litmos.users.search('some@email.com')`
   *
   * If called outside a method chain, an error will be thrown
   *
   * @param {string} term Search term to use
   * @param {object} params Optional query parameters to add to the request
   */
  async search(term, params = {}) {
    // Validate
    if (typeof term !== 'string' || !term) throw new Error('Valid search term required for Litmos API Search');
    params.search = term;

    return get(params);
  }

  /**
   * Used to perform a "GET" request on the Litmos API. This function must always come after a chain of
   * path identifiers - for example:
   * `litmos.users.get()`
   *
   * If called outside of a method chain, an error will be thrown
   *
   * @param {object} params Optional query parameters to add to the request
   */
  async get(params = {}) {
    let opts = {
      endpoint: this._endpoint.join('/'),
      method: 'GET',
      path: this._determinePath(this._endpoint)
    };

    // Combine options with supplied parameters
    opts = Object.assign(params, opts);

    const res = await this._request.api(opts);
    this._endpoint.length = 0;
    return res;
  }

  /**
   * Used to perform "POST" requests on the Litmos API. This function must always come after a chain of
   * path identifiers - for example:
   * `litmos.users.post({user-data})`
   *
   * If called outside of a method chain, an error will be thrown
   *
   * @param {object} data Data to post to Litmos
   * @param {*} params Optional query parameters to add to the request
   */
  async post(data, params = {}) {
    const path = this._determinePath(this._endpoint);
    const body = {};

    // We need to create an object that will resolve to the following XML pattern ("Users" is a placeholder example)
    // The _determinePath function used to process incoming data also works for generating data - as the
    // last known endpoint part _should_ identify the type of data being sent
    /*
    <Users>
      <User>
        <Id>Some id</Id>
      </User>
      <User>
        <Id>Some other Id</Id>
      </User>
    </Users>
    */
    // This is equivalent to the following JSON:
    /*
    {
      Users: [
        {
          User: {
            Id: Some id
          }
        },
        {
          User: {
            Id: Some other Id
          }
        }
      ]
    }
    */

    if (!lodash.isArray(data)) data = [data];
    body[path[0]] = [];
    data.forEach((item) => {
      const subItem = {};
      subItem[path[1]] = item;
      body[path[0]].push(subItem);
    });
    const opts = {
      endpoint: this._endpoint.join('/'),
      method: 'POST',
      path,
      body
    };

    // Do some additional error checking here in case there is an issue
    let res;
    try {
      res = await this._request.api(opts);
    } catch (e) {
      // Log the error and continue to unravel the stack
      console.error(e);
      throw e;
    }
    this._endpoint.length = 0;
    return res;
  }
}

module.exports = Litmos;
