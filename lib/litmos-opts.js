'use strict';

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
     * The number of items to return per page. Optional: Default 1000
     */
    this.perPage = opts.perPage || 1000;

    /**
     * Flag identifying if verbose logging should be made. Optional: Default false
     */
    this.verbose = opts.verbose || false;

    /**
     * Base URL used for all API requests. Optional: Default "https://api.litmos.com/v1.svc/"
     */
    this.baseUrl = opts.baseUrl || 'https://api.litmos.com/v1.svc/';

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
