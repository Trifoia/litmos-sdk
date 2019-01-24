'use strict';

// The fs module is used to save results for testing purposes
// const fs = require('fs');
// const serializeCount = 0;

const lodash = require('lodash');
const request = require('request');

const LitmosOpts = require('./litmos-opts.js');
const XML = require('./xml.js');

/**
 * This helper class is used to manage requests to the Litmos API. This class should only be used internally
 */
class Request {
  /**
   * Constructor will define options
   *
   * @param {LitmosOpts} opts Valid options are defined by the litmos-opts module
   */
  constructor(opts) {
    // Run the provided options through the litmos option constructor to find errors and generate defaults
    this.options = new LitmosOpts(opts);
  }

  /**
   * Perform an arbitrary request to the Litmos API
   *
   * @param {String} endpoint The endpoint to make the request to
   * @param {String} method The method of the request
   * @param {String} body Optional XML String body data
   * @param {String[]} path Path for the actual data. Valid as list of arguments
   *
   * @return {Promise} Promise
   */
  async api(endpoint, method, body, ...path) {
    const opts = {
      endpoint: endpoint,
      method: method,
      body: body
    };
    return this._makeRequest(opts, path);
  }

  /**
   * Getter will generate an apiKey + source query string from available values
   *
   * @private
   */
  get _keyAndSourceQuery() {
    return `?apiKey=${this.options.apiKey}&source=${this.options.source}`;
  }

  /**
   * Simple wrapper for the `request` function allows proxying of the requests for testing purposes
   *
   * @param {Object} opts Options to pass to `request`
   * @param {Function} cb Callback fired when the request is completed
   */
  _req(opts, cb) {
    request(opts, cb);
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
    opts.uri = this.options.baseUrl + opts.endpoint + this._keyAndSourceQuery;

    // Add the search query if applicable
    if (opts.search) {
      opts.uri += `&search=${opts.search}`;
    }

    // Make sure the method is upper case
    opts.method = opts.method.toUpperCase();

    // If this is a GET request, set the limit and position
    if (opts.method === 'GET') {
      opts.uri += `&limit=${this.options.perPage}`;
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
      this._req(opts, async (err, res) => {
        // TESTING
        // const serialize = {
        //   opts: opts,
        //   err: err,
        //   res: res
        // };
        // fs.writeFileSync(`data${serializeCount++}.js`, JSON.stringify(serialize, null, 2));

        if (err) {
          return reject(err);
        }

        // Determine if there was an error
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(res);
        }

        // Convert body to a js object
        if (res.body) {
          // Don't bother cleaning the data at this point, it will be cleaned later
          res.body = XML.toJS(res.body, path, false);
        }

        // Check if we need to paginate. If there are exactly as many elements as the perPage limit, attempt a new
        // request with a new position
        if (res.body.length === this.options.perPage) {
          originalOpts.position += this.options.perPage;
          const concatRes = res.body.concat(await this._makeRequest(originalOpts, path));

          // If the number of requests per page is a divisor of the total number of items, the last element will be
          // just attribute data
          const nullObject = {
            _attributes: {
              'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
            }
          };
          if (lodash.isEqual(nullObject, concatRes[concatRes.length - 1])) {
            concatRes.pop();
          }

          return resolve(XML.toJS(concatRes));
        }

        return resolve(XML.toJS(res.body));
      });
    });
  }
}

module.exports = Request;
