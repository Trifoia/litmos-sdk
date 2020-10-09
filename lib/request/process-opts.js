'use strict';

const {litmosOpts} = require('../../config.js');

const processBody = require('./process-body.js');

/**
 * Processes options for a request to the Litmos API
 * 
 * @param {object} context Request object making the request
 * @param {string} method HTTP method. Valid options are GET, PUT, POST, and DELETE
 * @param {object} body Unprocessed body for upload to the Litmos API
 * @param {object} [params] Optional parameters
 */
const processOpts = (context, method, body = null, params = {}) => {
  if (['POST', 'PUT'].includes(method) && !body) {
    throw new Error('Expected "body" option for Litmos API request with methods POST or PUT');
  }

  // Generate endpoint string
  const endpointStr = context._endpoint.join('/');

  // Generate parameter string
  let paramStr = '';
  for (const paramName in params) {
    paramStr += `&${paramName}=${params[paramName]}`;
  }

  // Generate options!
  const opts = {
    method,
    url: `${litmosOpts.baseUrl}${endpointStr}?source=${litmosOpts.source}${paramStr}`,
    headers: {
      'Content-Type': 'application/xml',
      'apikey': litmosOpts.apiKey
    },
    timeout: litmosOpts.timeout
  };

  if (body) opts.data = processBody(body, context._reqPath);

  return opts;
};

module.exports = processOpts;
