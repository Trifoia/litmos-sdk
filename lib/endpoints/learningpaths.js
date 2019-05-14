'use strict';

/*
  The `valid-jsdoc` rule has to be ignored so that IntelliSense documentation can properly chain past the "id" methods.
  If the `@return` value is defined for these methods the documentation chain breaks
*/
/* eslint-disable valid-jsdoc */

const get = require('../request/get.js');

const applyRequest = require('../utils/apply-request.js');

// Endpoints to Support:
// /learningpaths  - get
//   /{lpId}         - get
//     /courses        - get
//     /users          - get

/**
 * Starting point for the 'courses' API paths
 */
const learningpaths = {
  _endpoint: ['learningpaths'],
  _resPath: ['LearningPaths', 'LearningPath'],

  /**
   * GET basic information for all learning paths
   *
   * @param {object} [params] Query parameters
   * @return {Promise} Promise will resolve with an array of learning path data
   */
  get,

  /**
   * Access to data for a specific learning path
   *
   * @param {string} learningpathId The Litmos ID of the learning path
   */
  id: function(learningpathId) {
    const req = this._request;
    return {
      _endpoint: ['learningpaths', learningpathId],
      _resPath: ['LearningPath'],
      _request: req,

      /**
       * GET data for this specific course
       *
       * @param {object} [params] Query parameters
       *
       * @return {Promise} Promise will resolve with an array with a single course object
       */
      get,

      /**
       * Access to this specific course's modules
       */
      courses: {
        _endpoint: ['learningpaths', learningpathId, 'courses'],
        _resPath: ['Courses', 'Course'],
        _request: req,

        /**
         * GET all courses that are part of this learning path
         *
         * @param {object} [params] Query parameters
         *
         * @return {Promise} Promise will resolve with an array of course data objects
         */
        get
      },
      /**
       * Access to this specific learning path's users
       */
      users: {
        _endpoint: ['learningpaths', learningpathId, 'users'],
        _resPath: ['Users', 'User'],
        _request: req,

        /**
         * GET all users assigned to this specific learning path
         *
         * @param {object} [params] Query parameters
         *
         * @return {Promise} Promise will resolve with an array of user data objects
         */
        get
      }
    };
  }
};

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  applyRequest(learningpaths, request);

  return learningpaths;
};

module.exports = generator;
