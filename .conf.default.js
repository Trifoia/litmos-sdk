'use strict';

/**
 * Default configuration file. Any values also present in the .conf.js file will be overridden
 * The configurations have two layers
 * 1. Category
 * 2. Value
 * 
 * This system does not support nesting beyond these two layers. Any object value will
 * be replaced with the entire object value in the secret config
 * 
 * All values marked as `undefined` must be defined in the .conf.js file
 */
module.exports = {
  /**
   * Configuration configurations (yo dawg)
   */
  config: {
    /**
     * If an error should be thrown for `undefined` configuration values
     */
    errorOnUndefined: false
  },

  /**
   * Default Litmos options. See `limos-opts.js` for more detailed documentation
   */
  litmosOpts: {
    /**
     * Litmos API Key. This value is required to operate the sdk
     */
    apiKey: undefined,

    /**
     * Source for api requests. This value is required to operate the sdk
     */
    source: undefined,

    /**
     * Number of API calls allowed per minute
     */
    rateLimit: 80,

    /**
     * Amount of time in ms to wait for a response before timing out
     */
    timeout: 10000,

    /**
     * Number of times to retry a failed request
     */
    retryCount: 2,

    /**
     * Number of items to return per page
     */
    perPage: 1000,

    /**
     * If additional logging should be performed
     */
    verbose: false,

    /**
     * Base URL used for API requests
     */
    baseUrl: 'https://api.litmos.com/v1.svc/'
  },

  /**
   * Configurations used in debugging
   */
  debug: {
    /**
     * Second API key that can be used to verify multi-api support
     */
    apiKey2: undefined
  }
};
