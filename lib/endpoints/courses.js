'use strict';

const get = require('../request/methods/get.js');

// Endpoints to Support:
// /courses        - get
//   /{courseId}     - get
//     /users          - get
//     /modules        - get

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  /**
   * Starting point for the 'courses' API paths
   */
  const courses = {
    _endpoint: ['courses'],
    _resPath: ['Courses', 'Course'],
    _request: request,

    /**
     * GET basic information for all courses
     *
     * @param {object} [params] Query parameters
     * @return {Promise} Promise will resolve with course data
     */
    get,

    /**
     * Access to data for a specific course
     *
     * @param {string} courseId The Litmos ID of the course
     */
    id: function(courseId) {
      return {
        _endpoint: ['courses', courseId],
        _resPath: ['Course'],
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
         * Access to this specific course's users
         */
        users: {
          _endpoint: ['courses', courseId, 'users'],
          _resPath: ['Users', 'User'],
          _request: request,

          /**
           * GET all users assigned to this specific course
           *
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with an array of user data objects
           */
          get
        },

        /**
         * Access to this specific course's modules
         */
        modules: {
          _endpoint: ['courses', courseId, 'modules'],
          _resPath: ['Modules', 'Module'],
          _request: request,

          /**
           * GET all modules that are part of this specific course
           *
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with an array of module data objects
           */
          get
        }
      };
    }
  };

  return courses;
};

module.exports = generator;
