'use strict';

const lodash = require('lodash');
const request = require('phin');

const LitmosOpts = require('../helpers/litmos-opts.js');
const XML = require('../utils/xml.js');
const wait = require('../utils/wait.js');

// Helper constants
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const VALID_METHODS = [GET, POST, PUT, DELETE];

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
    // Check to see if these options have already been constructed
    if (opts instanceof LitmosOpts) {
      this.options = opts;
    } else {
      this.options = new LitmosOpts(opts);
    }

    // Keep track of the total number of requests made
    this.requestCount = 0;

    // The last time a request was made - used if rate limiting is enabled
    this.lastRequestTime = 0;

    // Calculate the wait time in between requests if rate limiting is enabled
    if (opts.rateLimit) {
      this.timeBetweenRequests = 60000 / opts.rateLimit;
    }
  }

  /**
   * Perform an arbitrary request to the Litmos API
   *
   * @param {object} opts Options passed to the API request, has the following form:
```
{
  endpoint: <string>,   // Complete endpoint to query
  method: <string>,     // The request method. Valid options are GET, POST, PUT, DELETE
  body: <object|array>, // Body to be sent with POST or PUT data
  path: <string[]>      // The data path where received data can be found
}
```
   *
   * @return {Promise} Promise resolves with success data, rejects with a failure
   */
  async api(opts) {
    // endpoint, method, body, path
    // Parse the body if it exists and isn't a string
    if (!['undefined', 'null', 'string'].includes(typeof opts.body)) {
      opts.body = XML.toXML(opts.body);
    }

    // Validate required elements
    if (!opts.endpoint) throw new Error('Expected "endpoint" option for Litmos API request');
    if (!opts.method) throw new Error('Expected "method" option for Litmos API request');

    // Set method to upper case
    opts.method = opts.method.toUpperCase();

    // Validate method and body
    if (!VALID_METHODS.includes(opts.method)) throw new Error(`Invalid method for Litmos API Request: ${opts.method}`);
    if ([POST, PUT].includes(opts.method) && !opts.body) {
      throw new Error('Expected "body" option for Litmos API request with methods POST or PUT');
    }

    return this._makeRequest(opts);
  }

  /**
   * Used to send data to the Litmos API
   *
   * @param {object} context The object calling this method
   * @param {string} method HTTP Method (PUT or POST)
   * @param {object} data Data to post to Litmos
   * @param {object} params Optional query parameters to add to the request
   */
  async sendData(context, method, data, params = {}) {
    const body = {};

    // We need to create an object that will resolve to the following XML patterns. "User" is used as a placeholder
    /*
    Multi-Object XML:
      <Users>
        <User>
          <Id>Some id</Id>
        </User>
        <User>
          <Id>Some other Id</Id>
        </User>
      </Users>

    Multi-Object JSON:
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

    Single Object XML:
      <User>
        <Id>Some id</Id>
      </User>

    Single Object JSON:
      User: {
        Id: Some id
      }
    */

    // Use the length of the request path to determine how to build the request body
    if (!lodash.isArray(data)) data = [data];
    switch (context._reqPath.length) {
      case 1:
        body[context._reqPath[0]] = data[0];
        break;
      case 2:
        body[context._reqPath[0]] = [];
        data.forEach((item) => {
          const subItem = {};
          subItem[context._reqPath[1]] = item;
          body[context._reqPath[0]].push(subItem);
        });
        break;
    }

    const opts = {
      endpoint: context._endpoint.join('/'),
      path: context._resPath,
      method,
      body,
      params
    };

    // Do some additional error checking here in case there is an issue
    let res;
    try {
      res = await this.api(opts);
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
   * Getter will generate a source query string from available values
   *
   * @private
   */
  get _sourceQuery() {
    return `?source=${this.options.source}`;
  }

  /**
   * Simple wrapper for the `request` function allows proxying of the requests for testing purposes
   *
   * @param {Object} opts Options to pass to `request`
   */
  async _req(opts) {
    if (this.options.verbose) {
      // In verbose mode, log the request options while obscuring the api key
      const logOpts = lodash.cloneDeep(opts);
      logOpts.headers.apikey = 'SECRET';
      console.log(`Sending request with options: ${JSON.stringify(logOpts)}`);
    }
    return request(opts);
  }

  /**
   * Internal function used to actually make requests to the Litmos API. Opts can include
   * at least the following elements:
   *
   * - endpoint : String
   *   - REQUIRED. The endpoint to attempt to access. Ex: `/courses`. All
   *     endpoints MUST begin with the `/` character
   * - method : String
   *   - REQUIRED. The desired HTTP Method
   * - params : Object
   *   - Object map for url query parameters
   * - body : Object
   *   - Request body to be sent. Generally required for PUT or POST methods.
   *     This body should be converted into xml before sending
   *
   * Any other options defined by the `request` documentation can also be
   * overridden, except for the `url` options
   * https://github.com/request/request#requestoptions-callback
   *
   * @private
   * @param {String} opts Options object
   * @param {boolean} [originalCall] Default true. Should be false if calling as part of pagination
   *
   * @return {Promise} Promise
   */
  async _makeRequest(opts, originalCall = true) {
    // Set default options
    const defaultParams = {
      start: 0,
      limit: this.options.perPage
    };
    const usingCustomLimit = !!opts.params.limit && originalCall;
    opts.params = Object.assign(defaultParams, opts.params);

    // Save the original options
    const originalOpts = lodash.cloneDeep(opts);

    // Extract the path
    const dataPath = opts.path;
    delete opts.path;

    // First combine the endpoint and other established "bits" to generate the
    // url. This will overwrite a url given to us. That's okay
    opts.url = this.options.baseUrl + opts.endpoint + this._sourceQuery;
    delete opts.endpoint;

    // Apply additional parameters
    let paramStr = '';
    for (const paramName in opts.params) {
      paramStr += `&${paramName}=${opts.params[paramName]}`;
    }
    opts.url += paramStr;
    delete opts.params;

    // Make sure the method is upper case
    opts.method = opts.method.toUpperCase();

    // Add the correct headers
    opts.headers = {
      'Content-Type': 'application/xml',
      'apikey': this.options.apiKey
    };

    // Change "body" to "data"
    opts.data = opts.body;
    delete opts.body;

    // We may need to do some waiting
    if (this.options.rateLimit) {
      const now = Date.now();
      const timeDelta = now - this.lastRequestTime;
      if (timeDelta < this.timeBetweenRequests) {
        // We need to wait for our next chance. First set the new last request time to the moment
        // we _expect_ to perform this request
        const waitTime = this.timeBetweenRequests - timeDelta;
        this.lastRequestTime = now + waitTime;
        if (this.options.verbose) console.log(`Rate Limited. Performing next request in ${waitTime}ms. Current time: ${now}`);
        await wait(waitTime);
      } else {
        // If we don't need to wait set the last request time to right now
        this.lastRequestTime = now;
      }
    }

    // Send the request!
    const res = await this._req(opts);

    res.body = res.body.toString();
    this.requestCount++;

    // Determine if there was an error
    if (res.statusCode < 200 || res.statusCode > 299) {
      throw res;
    }

    // Convert body to a js object
    if (res.body) {
      // Don't bother cleaning the data at this point, it will be cleaned later
      res.body = XML.toJS(res.body, dataPath, false);
    }

    // Check if we need to paginate. If there are exactly as many elements as the perPage limit, attempt a new
    // request with a new position
    if (!usingCustomLimit && res.body.length === originalOpts.params.limit) {
      originalOpts.params.start += originalOpts.params.limit;
      const concatRes = res.body.concat(await this._makeRequest(originalOpts, false));

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

      return XML.toJS(concatRes);
    }

    return XML.toJS(res.body);
  }
}

module.exports = Request;
