'use strict';

// Super fast polyfill for forEach that allows breaking!
Object.prototype.forEach = function(iterator) {
  const keys = Object.keys(this);
  for (let i = 0; i<keys.length; i++) {
    if (iterator(this[keys[i]], keys[i]) === false) {
      break;
    };
  }
};

// TODO: Remove the `request` module - it's way too big
const request = require('request');
const xmlConvert = require('xml-js');
const lodash = require('lodash');

/**
 * Base URL used for all API requests
 */
const BASE_URL = 'https://api.litmos.com/v1.svc';

/**
 * The maximum number of elements that can be requested at a time, this is
 * defined by limitations imposed by the Litmos API
 */
const LIMIT_MAX = 1000;

/**
 * Client for interacting with the Litmos API
 */
class Litmos {
  /**
   * The Litmos client constructor takes an "options" parameter with the
   * following elements:
   * - apiKey
   *   - REQUIRED. The Litmos API key to use. NOTE: The API key also defines the Litmos Account
   * - source
   *   - REQUIRED. Free text description of this app
   * - perPage
   *   - Optional. How many items to get per page - default 1000
   * - verbose
   *   - Optional. A truthy value enables verbose mode - default false
   *
   * @param {Object} opts Options
   */
  constructor(opts) {
    if (!opts.apiKey || !opts.source) {
      throw new Error(`Litmos constructor Error: Missing API Key or Source`);
    }

    // Assign values
    this.apiKey = opts.apiKey;
    this.source = opts.source;

    this.perPage = opts.perPage || LIMIT_MAX;
    this.verbose = opts.verbose || false;

    this.requestQueue = null;
  }

  /**
   * Gets all (currently up to 1000) Litmos users
   *
   * TODO: Support Pagination
   * @return {Promise} Promise
   */
  async getAllUsers() {
    // Generate options
    const opts = {
      endpoint: '/users',
      method: 'GET'
    };
    return this._makeRequest(opts, 'Users', 'User');
  }

  /**
   * Gets a specific user with a specified ID
   *
   * @param {String} id The user's API Id
   *
   * @return {Promise}
   */
  async getUser(id) {
    // Generate options
    const opts = {
      endpoint: `/users/${id}`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'User');
  }

  /**
   * Attempts to find a user with a given search string
   *
   * @param {String} search String to search by
   *
   * @return {Promise} Promise
   */
  async getUserWithSearch(search) {
    // Generate options
    const opts = {
      endpoint: '/users',
      search: search,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Users', 'User');
  }

  /**
   * Gets all Litmos teams
   *
   * @return {Promise} Promise
   */
  async getAllTeams() {
    // Generate options
    const opts = {
      endpoint: '/teams',
      method: 'GET'
    };
    return this._makeRequest(opts, 'Teams', 'Team');
  }

  async createTeam(teamName, description, parentId = null) {
    const data = {
      Name: teamName,
      Description: description
    };

    const xmlBody = await this._jsToXml({Team: data});
    const opts = {
      endpoint: '/teams' + (parentId ? `/${parentId}/teams` : ''),
      method: 'POST',
      body: xmlBody
    };

    return this._makeRequest(opts, 'Team');
  }

  /**
   * Gets all (up to 1000) Learning Paths
   *
   * @return {Promise} Promise
   */
  async getAllLearningPaths() {
    const opts = {
      endpoint: '/learningpaths',
      method: 'GET'
    };
    return this._makeRequest(opts, 'LearningPaths', 'LearningPath');
  }

  /**
   * Gets LearningPath data from Litmos with a specific ID. NOTE: The
   * learningPathId parameter is the user's ID within the Litmos API, NOT the
   * 'originalId' which is used for Frontend operations
   *
   * @param {String} learningPathId Learning PathId ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getLearningPathWithId(learningPathId) {
    const opts = {
      endpoint: `/learningpaths/${learningPathId}`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'LearningPath');
  }

  /**
   * Gets all of the courses associated with a given learning path. NOTE: The
   * learningPathId parameter is the user's ID within the Litmos API, NOT the
   * 'originalId', which is used for Frontend operations
   *
   * @param {String} learningPathId Learning Path ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getLearningPathCourses(learningPathId) {
    const opts = {
      endpoint: `/learningpaths/${learningPathId}/courses`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Courses', 'Course');
  }

  /**
   * Gets all (up to 1000) Learning Paths
   *
   * @return {Promise} Promise
   */
  async getAllCourses() {
    // Generate options
    const opts = {
      endpoint: '/courses',
      method: 'GET'
    };
    return this._makeRequest(opts, 'Courses', 'Course');
  }

  /**
   * Gets all the courses associated with a given user. NOTE: The userId
   * parameter is the user's ID within the Litmos API, NOT the 'originalId',
   * which is used for Frontend operations
   *
   * @param {String} userId User ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getCoursesAssignedToUser(userId) {
    const opts = {
      endpoint: `/users/${userId}/courses`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Courses', 'Course');
  }

  /**
   * Get specific course details associated with a given user. This includes
   * completion data for the course, as well as for all the course's modules
   *
   * NOTE: The userId, and courseId parameters is the user's and course's ID
   * within the Litmos API, NOT the 'originalId', which is used for Frontend
   * operations
   *
   * @param {String} userId User ID taken from the Litmos API
   * @param {String} courseId Course ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getCourseAssignedToUserWithId(userId, courseId) {
    const opts = {
      endpoint: `/users/${userId}/courses/${courseId}`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Course');
  }

  /**
   * Gets Course data from Litmos with a specific ID. NOTE: The courseId
   * parameter is the user's ID within the Litmos API, NOT the 'originalId',
   * which is used for Frontend operations
   *
   * @param {String} courseId Course ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getCourseWithId(courseId) {
    const opts = {
      endpoint: `/courses/${courseId}`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Courses', 'Course');
  }

  /**
   * Gets all of the modules associated with a given course. NOTE: The courseId
   * parameter is the user's ID within the Litmos API, NOT the 'originalId',
   * which is used for Frontend operations
   *
   * @param {String} courseId Course ID taken from the Litmos API
   *
   * @return {Promise} Promise
   */
  async getCourseModules(courseId) {
    const opts = {
      endpoint: `/courses/${courseId}/modules`,
      method: 'GET'
    };
    return this._makeRequest(opts, 'Modules', 'Module');
  }

  /**
   * Attempts to set a module completion for a given Module. The body parameter
   * can have the following elements (note casing):
   * - CourseId : String | REQUIRED
   *   - The Litmos ID of the Course that contains the module being completed
   * - UserId : String | REQUIRED
   *   - The Litmos ID of the User that the module is being completed for
   * - Score : Number | DEFAULT: null
   *   - Score between 0 and 100, nor null for no score
   * - Completed : boolean | DEFAULT: true
   *   - Flag indicating if the module is complete
   * - UpdatedAt : ISOString | DEFAULT: Now
   *   - Date (in the form of an ISO string) the module result was updated
   * - Note : String | DEFAULT: 'APIEnabledCompletion
   *   - Special note for the completion
   *
   * @param {String} moduleId ID of the Module to be marked complete
   * @param {Object} body Body information
   *
   * @return {Promise} Promise
   */
  async setModuleCompletion(moduleId, body) {
    const obj = {
      Score: null,
      Completed: true,
      UpdatedAt: (new Date()).toISOString(),
      Note: 'APIEnabledCompletion'
    };

    // Override defaults and add required fields
    Object.assign(obj, body);

    // Litmos requires the request body xml to be in a very specific order. We
    // must create a new object that will match this order
    const orderedObj = {
      CourseId: obj.CourseId,
      UserId: obj.UserId,
      Score: obj.Score,
      Completed: obj.Completed,
      UpdatedAt: obj.UpdatedAt,
      Note: obj.Note
    };

    // Delete the Score if it wasn't provided
    if (!orderedObj.Score) {
      delete orderedObj.Score;
    }

    const xmlBody = await this._jsToXml({ModuleResult: orderedObj});
    console.log(xmlBody);
    const opts = {
      endpoint: `/results/modules/${moduleId}`,
      method: 'PUT',
      body: xmlBody
    };

    return this._makeRequest(opts);
  }

  /**
   * Perform an arbitrary request to the Litmos API
   *
   * @param {String} endpoint The endpoint to make the request to
   * @param {String} method The method of the request
   * @param {String} body Optional XML String body data
   *
   * @return {Promise} Promise
   */
  async api(endpoint, method, body) {
    const opts = {
      endpoint: endpoint,
      method: method,
      body: body
    };
    return this._makeRequest(opts);
  }

  /**
   * Will attempt to mark a given module complete using data available to the
   * Litmos frontend. The provided data object must have the following elements:
   * - userName
   *   - The `user name` associated with the given user
   * - courseId
   *   - The `Original ID` of the course that contains the module being
   *     completed
   * - moduleCode OR moduleName
   *   - The unique code associated with a module, or that module's name
   *
   * @param {Object} data Data Object
   *
   * @return {Promise} Promise
   */
  async markModuleComplete(data) {
    // Get all the needed Ids
    const email = data.userName;
    const courseOriginalId = data.courseId;
    const moduleCode = data.moduleCode || data.moduleName;
    return this._getUserCourseAndModuleId(email, courseOriginalId, moduleCode)
        .then((adventure) => {
          console.log('Got all data');

          // Finally, actually mark the module complete!
          const moduleId = adventure.moduleId;
          const body = {
            UserId: adventure.userId,
            CourseId: adventure.courseId
          };
          console.log(body);
          console.log(moduleId);
          return this.setModuleCompletion(moduleId, body);
        }).then((adventure) => {
          // If we got here it means success!
          return Promise.resolve('success');
        }).catch((err) => {
          console.error(`An Error Occurred Marking Course Completion: ${JSON.stringify(err)}`);
          return Promise.reject(err);
        });
  }

  /**
   * Will attempt to determine if a given module is complete or not for a given
   * user
   *
   * - userName
   *   - The `user name` associated with the given user
   * - courseId
   *   - The `Original ID` of the course that contains the module being
   *     completed
   * - moduleCode OR moduleName
   *   - The unique code associated with a module, or that module's name
   *
   * @param {Object} data Data Object
   *
   * @return {Promise} Promise
   */
  async getModuleCompletion(data) {
    // Get all the needed Ids
    const email = data.userName;
    const courseOriginalId = data.courseId;
    const moduleCode = data.moduleCode || data.moduleName;

    // We will need this later
    let moduleId = null;
    return this._getUserCourseAndModuleId(email, courseOriginalId, moduleCode)
        .then((adventure) => {
          // Destructuring ftw!
          const {userId, courseId} = adventure;
          moduleId = adventure.moduleId;

          // Get the course progress for the user
          return this.getCourseAssignedToUserWithId(userId, courseId);
        }).then((adventure) => {
          // Go through the modules and find the current one
          const currentModule = adventure.Modules.Module.find((module) => {
            // TODO: Process sub-arrays recursively
            if (module.Id._text === moduleId) return true;
          });

          // Finally, resolve the completion status!
          return Promise.resolve(currentModule.Completed._text);
        }).catch((err) => {
          console.error(`An Error Occurred Marking Course Completion: ${JSON.stringify(err)}`);
          return Promise.reject(err);
        });
  }

  /**
   * Helper function specifically gets a user's Id
   *
   * @private
   * @param {String} email A user's email (username)
   *
   * @return {Promise} Promise
   */
  async _getUserId(email) {
    return this.getUserWithSearch(email).then((adventure) => {
      return Promise.resolve(adventure[0].Id);
    });
  }

  /**
   * Helper function will get both a user and course Id for a given email
   * and course original id
   *
   * @private
   * @param {String} email Email Address associated with the user
   * @param {String} courseOriginalId The course's "OriginalId" available
   *                                  through the Litmos frontend
   *
   * @return {Promise} Promise
   */
  async _getUserAndCourseId(email, courseOriginalId) {
    let userId = null;
    let courseId = null;

    // First get the user's Id
    return this._getUserId(email).then((adventure) => {
      // Now get the course Id. First by getting all the courses associated
      // with the user
      userId = adventure;
      return this.getCoursesAssignedToUser(userId);
    }).then((adventure) => {
      // Find the course that matches the OriginalId
      // Check for array
      if (!lodash.isArray(adventure)) {
        adventure = [adventure];
      }

      let match = null;
      adventure.forEach((value) => {
        if (value.OriginalId === courseOriginalId) {
          match = value;
          return;
        }
      });

      // We now know the actual course Id
      courseId = match.Id;

      // We can now resolve the course and user Id!
      return Promise.resolve({userId, courseId});
    });
  }

  /**
   * Helper function will get a user, course, and module Id from the given
   * data
   *
   * @private
   * @param {String} email Email Address associated with the user
   * @param {String} courseOriginalId The course's "OriginalId" available
   *                                  through the Litmos frontend
   * @param {String} moduleCode Either a module's unique "code" or it's name
   *
   * @return {Promise} Promise
   */
  async _getUserCourseAndModuleId(email, courseOriginalId, moduleCode) {
    let userId = null;
    let courseId = null;
    let moduleId = null;
    // First get the user and course Ids
    return this._getUserAndCourseId(email, courseOriginalId)
        .then((adventure) => {
          userId = adventure.userId;
          courseId = adventure.courseId;

          // Now get the course modules, so we can find out module Id
          return this.getCourseModules(courseId);
        }).then((adventure) => {
          // Make sure we are using an array
          if (!lodash.isArray(adventure)) {
            adventure = [adventure];
          }

          // Find the module that matches. First try assuming that the moduleCode is
          // actually a module code
          let match = null;

          // There should be a module code that matches on one of the modules
          adventure.forEach((value) => {
            if (match) return;
            if (value.Code && value.Code === moduleCode) {
              match = value;
              return;
            }
          });

          // If we didn't find a match with codes, check against names
          if (!match) {
            // If there is no code, we need to match by name-
            adventure.forEach((value) => {
              if (match) return;
              if (value.Name === moduleCode) {
                match = value;
                return;
              }
            });
          }

          // We should have found a match
          moduleId = match.Id;

          // Resolve data!
          return Promise.resolve({userId, courseId, moduleId});
        });
  }

  /**
   * Getter will generate an apiKey + source query string from available values
   *
   * @private
   */
  get _keyAndSourceQuery() {
    return `?apiKey=${this.apiKey}&source=${this.source}`;
  }

  /**
   * Simple wrapper of `xml-js.js2xml` will convert a simple js object to XML
   *
   * @private
   * @param {Object} js JavaScript object to be converted to XML
   *
   * @return {Promise} Promise
   */
  async _jsToXml(js) {
    return xmlConvert.js2xml(js, {compact: true});
  }

  /**
   * Internal function used to actually make requests to the Litmos API. Opts
   * can include at least the following elements:
   *
   * - endpoint : String
   *   - REQUIRED. The endpoint to attempt to access. Ex: `/courses`. All
   *     endpoints MUST begin with the `/` character
   * - method : String
   *   - REQUIRED. The desired HTTP Method
   * - search : String
   *   - Search parameters that should be appended to the URI
   * - body : Object
   *   - Request body to be sent. Generally required for PUT or POST methods.
   *     This body should be converted into xml before sending
   * - position: Number
   *   - Start position used for pagination. Default 0
   *
   * Any other options defined by the `request` documentation can also be
   * overridden, except for the `uri` options
   * https://github.com/request/request#requestoptions-callback
   *
   * @private
   * @param {String} opts Options object
   * @param {String[]} path Path for the actual data. Valid as list of arguments
   *
   * @return {Promise} Promise
   */
  async _makeRequest(opts, ...path) {
    // Set default options
    const defaults = {
      position: 0
    };
    opts = Object.assign(defaults, opts);

    // Save the original options
    const originalOpts = lodash.cloneDeep(opts);

    // Allow an array for the path argument
    path = lodash.flatten(path);

    // First combine the endpoint and other established "bits" to generate the
    // uri. This will overwrite a uri given to us. That's okay
    opts.uri = BASE_URL + opts.endpoint + this._keyAndSourceQuery;

    // Add the search query if applicable
    if (opts.search) {
      opts.uri += `&search=${opts.search}`;
    }

    // Make sure the method is upper case
    opts.method = opts.method.toUpperCase();

    // If this is a GET request, set the limit and position
    if (opts.method === 'GET') {
      opts.uri += `&limit=${this.perPage}`;
      opts.uri += `&start=${opts.position}`;
    }

    // Delete elements we don't need anymore
    delete opts.endpoint;
    delete opts.search;

    // Add the correct content Type
    opts.headers = {
      'Content-Type': 'application/xml'
    };

    // Send the request and wrap it in a promise
    return new Promise(async (resolve, reject) => {
      request(opts, async (err, res) => {
        if (err) {
          return reject(err);
        }

        console.log(res.body);

        // Convert body to a js object
        if (res.body) {
          res.body = xmlConvert.xml2js(res.body, {compact: true});
        }

        // Determine if there was an error
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(res);
        }

        // Use the provided path
        path.forEach((p) => {
          if (res.body[p]) res.body = res.body[p];
        });

        // Check if we need to paginate. If there are exactly as many elements
        // as the perPage limit, attempt a new request with a new position
        if (res.body.length === this.perPage) {
          originalOpts.position += this.perPage;
          const concatRes = res.body.concat(await this._makeRequest(originalOpts, path));

          // If the number of requests per page is a divisor of the total number
          // of items, the last element will be just attribute data
          const nullObject = {
            _attributes: {
              'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
            }
          };
          if (lodash.isEqual(nullObject, concatRes[concatRes.length - 1])) {
            concatRes.pop();
          }

          return resolve(this._processResData(concatRes));
        }

        return resolve(this._processResData(res.body));
      });
    });
  }

  /**
   * Takes a response from the _makeRequest method and removes xml artifacts
   * left over from conversion to json. This method assumes that the object
   * given to it has already been flattened
   *
   * @param {Object} res Response object from _makeRequest
   *
   * @return {Object} Processed response
   */
  _processResData(res) {
    // Make sure res is an array
    if (!lodash.isArray(res)) res = [res];

    const out = lodash.cloneDeep(res);
    res.forEach((resValue, resIndex) => {
      resValue.forEach((value, key) => {
        /*
        Original xml if there is a `_text` element:
          <key>_text</key>

        This should equate to this json:
          {
            key: '_text'
          }
        */
        if (value._text) {
          out[resIndex][key] = value._text;
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
          out[resIndex][key] = null;
          return;
        }
      });
    });

    return out;
  }
}

module.exports = Litmos;
