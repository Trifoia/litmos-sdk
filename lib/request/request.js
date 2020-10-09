'use strict';

const lodash = require('lodash');
const request = require('phin');

const {litmosOpts} = require('../../config.js');

const processOpts = require('./process-opts.js');
const send = require('./send.js');

const checkStatusCode = require('../utils/check-status-code.js');
const rateLimit = require('../utils/rate-limit.js');
const xml = require('../utils/xml.js');

/**
 * This helper class is used to manage requests to the Litmos API. This class should only be
 * used internally
 */
class Request {
  /**
   * Constructor will instantiate options
   */
  constructor() {
    // Keep track of the total number of requests made
    this.requestCount = 0;

    // The last time a request was made - used if rate limiting is enabled
    this.lastRequestTime = 0;
  }

  /**
   * Sends a request to the Litmos API. Should only be called by one of the endpoint methods
   *
   * @param {object} context Request object making the request
   * @param {string} method HTTP method. Valid options are GET, PUT, POST, and DELETE
   * @param {object} body Unprocessed body for upload to the Litmos API
   * @param {object} [params] Optional parameters
   *
   * @return {Promise} Promise
   */
  async sendRequest(context, method, body, params, originalCall = true) {
    const usingCustomLimit = params && !!params.limit && originalCall;

    // Set default parameters
    const defaultParams = {
      start: 0,
      limit: litmosOpts.perPage
    };
    params = Object.assign(defaultParams, params);

    // We may need to do some waiting
    this.lastRequestTime = await rateLimit(this.lastRequestTime);

    // Send the request!
    const res = await send(processOpts(context, method, body, params));

    res.body = res.body.toString();
    this.requestCount++;

    // Determine if there was an error
    if (!checkStatusCode(res.statusCode)) {
      const error = new Error(`Invalid response code from Litmos API: ${res.statusCode}`);
      Object.assign(error, res);
      throw error;
    }

    // Convert body to a js object
    if (res.body) {
      // Don't bother cleaning the data at this point, it will be cleaned later
      res.body = xml.toJS(res.body, context._resPath || [], false);
    }

    // Check if we need to paginate. If there are exactly as many elements as the perPage
    // limit, attempt a new request with a new position

    // API ISSUE NOTE: It turns out that sometimes the Litmos API will actually return more
    // items than requested. This needs to be accounted for
    if (!usingCustomLimit && res.body.length >= params.limit) {
      params.start += res.body.length;
      const concatRes = res.body.concat(
        await this.sendRequest(context, method, body, params, false)
      );

      // If the number of requests per page is a divisor of the total number of items, the
      // last element will be just attribute data
      const nullObject = {
        _attributes: {
          'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
        }
      };
      if (lodash.isEqual(nullObject, concatRes[concatRes.length - 1])) {
        concatRes.pop();
      }

      return xml.toJS(concatRes);
    }

    return xml.toJS(res.body);
  }

  /**
   * Simple wrapper for the `request` function allows proxying of the requests for testing
   * purposes
   *
   * @param {Object} opts Options to pass to `request`
   */
  async _req(opts) {
    if (litmosOpts.verbose) {
      // In verbose mode, log the request options while obscuring the api key
      const logOpts = lodash.cloneDeep(opts);
      logOpts.headers.apikey = 'SECRET';
      console.log(`Sending request with options: ${JSON.stringify(logOpts)}`);
    }
    return request(opts);
  }
}

module.exports = Request;
