'use strict';

/*
 * Performs a POST request. This method must be bound to an object with an internal `_endpoint` array that
 * will be used to generate the endpoint to query. As such, this method _MUST NOT_ be defined using arrow notation
 *
 * @param {object} body JS Object body for the post request
 * @param {object} params URL Parameters
 */
const post = async function(body, params) {
  return this._request.sendData(this, 'POST', body, params);
};

module.exports = post;
