'use strict';

const lodash = require('lodash');

const LitmosOpts = require('./lib/litmos-opts.js');
const Request = require('./lib/request.js');

const generators = require('./lib/generators.js');
const helpers = require('./lib/litmos-helpers.js');

// String constants
const LEARNINGPATHS = 'learningpaths';
const USERS = 'users';
const TEAMS = 'teams';
const COURSES = 'courses';

// Paths
const PATHS = {};
PATHS[LEARNINGPATHS] = ['LearningPaths', 'LearningPath'];
PATHS[USERS] = ['Users', 'User'];
PATHS[TEAMS] = ['Teams', 'Team'];
PATHS[COURSES] = ['Courses', 'Course'];

/**
 * The Litmos class is the main entry-point or Litmos SDK operations
 */
class Litmos {
  /**
   * @private
   * Used internally for method chaining
   * Adds a string to the endpoint array. Will throw an error if that string is already present for all strings except
   * "teams" - since circular request paths are never used in Litmos except to access sub-teams
   *
   * @param {string} value String to add to the endpoint array
   */
  _addEndpoint(value) {
    // Special cases:
    // Sub-team access requires the use of multiple `team` endpoint values
    if (value === 'teams') {
      this._endpoint.push(value);
      return;
    }
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
   * Used to send data to the Litmos API. This function should only used internally
   *
   * If called outside of a method chain, an error will be thrown
   *
   * @param {string} method HTTP Method (PUT or POST)
   * @param {object} data Data to post to Litmos
   * @param {object} params Optional query parameters to add to the request
   */
  async _sendData(method, data, params = {}) {
    method = method.toUpperCase();
    const path = this._determinePath(this._endpoint);
    let body = {};

    // We need to create an object that will resolve to the following XML pattern ("Users" is a placeholder example)
    // The _determinePath function used to process incoming data also works for generating data - as the
    // last known endpoint part should identify the type of data being sent
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

    // Handle special cases
    // 1: Create a single user
    //    When creating a new user, the <Users> field (containing <User> fields) is not present
    if (this._endpoint.length === 1 && this._endpoint[0] === 'users') {
      body = body[path[0]][0];
    }

    // 2: Create or modify a single team
    //    When creating a new user, the <Teams> field (containing <Team> fields) is not present
    const isCreatingNewTeam = this._endpoint.length === 1 && this._endpoint[0] === 'teams';
    const isUpdatingTeam = this._endpoint.length === 2 && this._endpoint[0] === 'teams';
    const isCreatingSubTeam = this._endpoint.length === 3 && this._endpoint[0] === 'teams' && this._endpoint[2] === 'teams';
    if (isCreatingNewTeam || isUpdatingTeam || isCreatingSubTeam) {
      body = body[path[0]][0];
    }

    let opts = {
      endpoint: this._endpoint.join('/'),
      method, path, body
    };
    this._endpoint.length = 0;

    // Combine options with supplied parameters
    opts = Object.assign(params, opts);

    // Do some additional error checking here in case there is an issue
    let res;
    try {
      res = await this._request.api(opts);
    } catch (e) {
      // Log the error and continue to unravel the stack
      console.log(`\n${method} ERROR:`); console.group();
      console.error(e.body);
      console.error(`Status Code: ${e.statusCode}`); console.groupEnd();
      throw e;
    }
    return res;
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
      learningpaths: this.learningpaths,
      teams: this.teams
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
      users: this.users,
      courses: this.courses
    };

    /**
     * Base "teams" endpoint access
     */
    this.teams = {
      // Generate chainable functions
      id: generators.generateId(this, TEAMS),

      // Generate non-chainable functions
      get: generators.generateGet(this, TEAMS),
      post: generators.generatePost(this, TEAMS),

      // Attach valid sub-paths
      teams: this.teams,
      users: this.users,
      learningpaths: this.learningpaths
    };

    /**
     * Base "courses" endpoint access
     */
    this.courses = {
      // Generate chainable functions
      id: generators.generateId(this, COURSES),

      // Generate non-chainable functions
      get: generators.generateGet(this, COURSES),

      // Attach valid sub-paths
      users: this.users
    };

    /**
     * Helper methods that assist with more complicated functionality
     */
    this.helpers = helpers;
  }

  /**
   * The total number of API calls made to the Litmos API. Note that sometimes a single request can use
   * multiple API calls if pagination was required
   */
  get requestCount() {
    return this._request.requestCount;
  }

  /**
   * Allows the injection of an arbitrary path into the request chain. ex:
```
litmos.setPath(['users', 'user-id', 'learningpaths']).get();
// Is the same as...
litmos.users.id('user-id').learningpaths.get()
```
   *
   * This is useful for programmatically determining endpoints
   *
   * @param {string[]} pathArr The endpoint to make a request against, in array form
   * @return {object} `this`
   */
  setPath(pathArr) {
    this._endpoint = pathArr;
    return this;
  }

  /**
   * Performs a search operation with a specific term. This function must always come after a chain of path
   * identifiers - for example:
   * `litmos.users.search('some@email.com')`
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
   * @param {object} [params] Query parameters to add to the request
   */
  async get(params = {}) {
    let opts = {
      endpoint: this._endpoint.join('/'),
      method: 'GET',
      path: this._determinePath(this._endpoint)
    };

    // Combine options with supplied parameters
    opts = Object.assign(params, opts);

    this._endpoint.length = 0;
    const res = await this._request.api(opts);
    return res;
  }

  /**
   * Used to perform "PUT" requests on the Litmos API. The PUT method is generally used for updating records. This
   * function must always come after a chain of path identifiers - for example:
   * `litmos.users.put({user-data})`
   *
   * If called outside of a method chain, an error will be thrown
   *
   * @param {object} data Data to put to Litmos
   * @param {*} params Optional query parameters to add to the request
   */
  async put(data, params = {}) {
    return this._sendData('PUT', data, params);
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
    return this._sendData('POST', data, params);
  }
}

module.exports = Litmos;
