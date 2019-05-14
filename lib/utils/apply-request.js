/**
 * Recursive helper function will apply the `request` module instance to the entire endpoint tree for a given endpoint
 *
 * @param {object} obj Object to assign request modules to
 * @param {object} request Request module instance to attach
 */
const applyRequest = function(obj, request) {
  obj._request = request;

  // Check for children that need the request object
  for (const key in obj) {
    // Ignore private members
    if (key.indexOf('_') === 0) continue;

    const val = obj[key];

    // Ignore non objects
    if (typeof val !== 'object') continue;

    // Recurse with this object!
    applyRequest(val, request);
  }
};

module.exports = applyRequest;
