'use strict';

const config = require('../../config.js');

/**
 * Special class defines options for the Litmos class and it's sub-classes
 */
class LitmosOpts {
  constructor(opts) {
    /**
     * The API key used to access litmos data. REQUIRED
     */
    this.apiKey = opts.apiKey;
    if (!this.apiKey) throw new Error('No "apiKey" option provided to LitmosOpts');

    /**
     * The `source` that is provided with all litmos data updates. REQUIRED
     */
    this.source = opts.source;
    if (!this.source) throw new Error('No "source" option provided to LitmosOpts');

    /**
     * The number of API calls allowed per minute. If not set then no rate limit restrictions
     * will be used. Optional: Default null
     */
    this.rateLimit = opts.rateLimit || config.litmosOpts.rateLimit;

    /**
     * How long to wait in ms before timing out a request. Will trigger a retry if a retry is
     * available. Optional: Default 10000
     */
    this.timeout = opts.timeout || config.litmosOpts.timeout;

    /**
     * Number of additional times to attempt a request before giving up. Set to 0 to disable
     * Optional: Default 2
     */
    this.retryCount = opts.retryCount || config.litmosOpts.retryCount;

    /**
     * The number of items to return per page. Optional: Default 1000
     */
    this.perPage = opts.perPage || config.litmosOpts.perPage;

    /**
     * Flag identifying if verbose logging should be made. Optional: Default false
     */
    this.verbose = opts.verbose || config.litmosOpts.verbose;

    /**
     * Base URL used for all API requests. Optional: Default "https://api.litmos.com/v1.svc/"
     */
    this.baseUrl = opts.baseUrl || config.litmosOpts.baseUrl;

    // Check for any extra options
    const thisKeys = Object.keys(this);
    const optsKeys = Object.keys(opts);
    optsKeys.forEach((key) => {
      if (!thisKeys.includes(key)) {
        console.warn(`Warning. Unknown option passed to LitmosOpts: "${key}". Ignoring`);
      }
    });
  }
}

module.exports = LitmosOpts;
