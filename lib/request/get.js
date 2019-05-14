'use strict';

/**
 * Performs a GET request. This method must be bound to an object with an internal `_endpoint` array that
 * will be used to generate the endpoint to query. As such, this method _MUST NOT_ be defined using arrow notation
 *
 * @param {object} params URL Parameters
 */
const get = async function(params = {}) {
  const opts = {
    endpoint: this._endpoint.join('/'),
    method: 'GET',
    path: this._resPath || [],
    params: params
  };

  return this._request.api(opts);
};

module.exports = get;
