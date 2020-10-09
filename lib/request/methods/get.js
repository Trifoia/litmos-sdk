'use strict';

/*
 * Performs a GET request. This method must be bound to an object with an internal `_endpoint`
 * array that will be used to generate the endpoint to query. As such, this method MUST NOT
 * be defined using arrow notation
 *
 * @param {object} params URL Parameters
 */
const get = async function(params = {}) {
  return this._request.sendRequest(this, 'GET', null, params);
};

module.exports = get;
