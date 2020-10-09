'use strict';

const {cloneDeep} = require('lodash');
const phin = require('phin');

const {litmosOpts} = require('../../config.js');

const checkStatusCode = require('../utils/check-status-code.js');

/**
 * Wrapper for the phin request library that adds automatic retries and additional logging
 *
 * @param {object} opts Phin options 
 * @param {phin} [requestLib] Request library. Only used for testing
 */
const send = async (opts, requestLib = phin) => {
  let retries = 0;
  let response;

  do {
    if (litmosOpts.verbose) {
      if (retries > 0) {
        console.log(`Received status code ${response.statusCode}. Retrying ${retries} / ${litmosOpts.retryCount}`);
      }
      // In verbose mode, log the request options while obscuring the api key
      const logOpts = cloneDeep(opts);
      logOpts.headers.apikey = 'SECRET';
      console.log(`Sending request with options: ${JSON.stringify(logOpts)}`);
    }

    const startTime = Date.now();
    try {
      response = await requestLib(opts);
    } catch(e) {
      if (e.message !== 'Timeout reached') throw e;

      // There was a timeout, construct the expected timeout body
      response = {
        statusCode: 408,
        body: {
          status: 'timeout',
          timeWaited: Date.now() - startTime,
          timeoutMs: opts.timeout
        }
      };
    }
  } while (++retries <= litmosOpts.retryCount && !checkStatusCode(response.statusCode));

  return response;
};

module.exports = send;
