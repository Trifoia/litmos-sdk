'use strict';

/*
 * Performs a DELETE request. This method must be bound to an object with an internal `_endpoint` array that
 * will be used to generate the endpoint to query. As such, this method _MUST NOT_ be defined using arrow notation
 *
 * @param {object} params URL Parameters
 */
const apiDelete = async function(params = {}) {
  const opts = {
    endpoint: this._endpoint.join('/'),
    method: 'DELETE',
    path: this._resPath || [],
    params: params
  };

  return this._request.api(opts);
};

module.exports = apiDelete;
