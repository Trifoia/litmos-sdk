'use strict';

/*
 * Performs a PUT request. This method must be bound to an object with an internal `_endpoint` array that
 * will be used to generate the endpoint to query. As such, this method _MUST NOT_ be defined using arrow notation
 *
 * @param {object} body JS Object body for the put request
 * @param {object} params URL Parameters
 */
const put = async function(body, params) {
  return this._request.sendData(this, 'PUT', body, params);
};

module.exports = put;
