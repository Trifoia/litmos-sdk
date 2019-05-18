'use strict';

/*
  The `valid-jsdoc` rule has to be ignored so that IntelliSense documentation can properly chain past the "id" methods.
  If the `@return` value is defined for these methods the documentation chain breaks
*/
/* eslint-disable valid-jsdoc */
const get = require('../request/get.js');

// Endpoints to Support:
// /learningpaths  - get
//   /{lpId}         - get
//     /courses        - get
//     /users          - get

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  /**
   * Starting point for the 'courses' API paths
   */
  const learningpaths = {
    _endpoint: ['learningpaths'],
    _resPath: ['LearningPaths', 'LearningPath'],
    _request: request,

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
      return {
        _endpoint: ['learningpaths', learningpathId],
        _resPath: ['LearningPath'],
        _request: request,

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
          _request: request,

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
          _request: request,

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

  return learningpaths;
};

module.exports = generator;
