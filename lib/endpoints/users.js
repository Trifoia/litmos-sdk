'use strict';

const generateUser = require('../generators/generate-user.js');

const get = require('../request/methods/get.js');
const post = require('../request/methods/post.js');
const put = require('../request/methods/put.js');
const apiDelete = require('../request/methods/delete.js');

// Endpoints to Support:
// /users                - get; post
//   /details              - get
//   /{userId OR username} - get; put
//     /teams                - get
//     /learningpaths        - get; post
//     /courses              - get; post
//       /{courseId}           - get

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  /**
   * Starting point for the 'users' API paths
   */
  const users = {
    _endpoint: ['users'],
    _resPath: ['Users', 'User'],
    _reqPath: ['User'],
    _request: request,

    /**
     * GET basic information for all users
     *
     * @param {object} [params] Query parameters
     * @return {Promise} Promise will resolve with user data
     */
    get,
    /**
     * POST a new user
     *
     * @param {object} body JS Object body for the post request
     * @param {object} [params] Query parameters
     *
     * @return {Promise} Promise will resolve with success or reject with failure
     */
    post: function(body, params) {
      // Make sure data is in the correct format
      body = generateUser(body);
      return post.call(this, [body, params]);
    },

    /**
     * Access to the user details endpoint. This endpoint can be used to get detailed user
     * information in bulk
     */
    details: {
      _endpoint: ['users', 'details'],
      _resPath: ['Users', 'User'],
      _request: request,

      /**
       * GET bulk user details. Note that for large litmos accounts this can be _a lot_ of
       * data
       *
       * @param {object} [params] Query parameters
       *
       * @return {Promise} Promise will resolve with user data
       */
      get
    },

    /**
     * Access to data for a specific user. Note that the `userId` argument can either be the
     * user's internal ID or the user's username for GET requests. However, the actual user
     * ID is _required_ for POST and PUT requests
     *
     * @param {string} userId The Litmos ID OR Username of the user
     */
    id: function(userId) {
      return {
        _endpoint: ['users', userId],
        _resPath: ['User'],
        _reqPath: ['User'],
        _request: request,

        /**
         * GET detailed user data for this specific user
         *
         * @param {object} [params] Query parameters
         *
         * @return {Promise} Promise will resolve with an array with a single user object
         */
        get,
        /**
         * PUT an update to this specific user
         *
         * @param {object} body JS Object body for the post request
         * @param {object} [params] Query parameters
         *
         * @return {Promise} Promise will resolve with success or reject with failure
         */
        put: function(body, params) {
          // Make sure data is in the correct format
          body = generateUser(body);
          return put.call(this, [body, params]);
        },

        /**
         * Access to this specific user's team data
         *
         * Note that teams cannot be "added" to users, users must instead be added to teams
         */
        teams: {
          _endpoint: ['users', userId, 'teams'],
          _resPath: ['Teams', 'Team'],
          _request: request,

          /**
           * GET team data for all the teams this specific user is a member of
           *
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with an array of team data objects
           */
          get
        },

        /**
         * Access to this specific user's learning path data
         */
        learningpaths: {
          _endpoint: ['users', userId, 'learningpaths'],
          _resPath: ['LearningPaths', 'LearningPath'],
          _reqPath: ['LearningPaths', 'LearningPath'],
          _request: request,

          /**
           * GET learningpath data for all the lps that this specific user has been assigned
           *
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with an array of learningpath data objects
           */
          get,
          /**
           * POST an existing learningpath to this specific user, assigning it to them
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post,

          /**
           * Access to data for a specific learningpath associated with this user. Currently, this endpoint is only
           * used to perform a DELETE operation
           *
           * @param {string} userId The Litmos ID OR Username of the user
           */
          id: function(lpId) {
            return {
              _endpoint: ['users', userId, 'learningpaths', lpId],
              _resPath: ['LearningPaths', 'LearningPath'],
              _reqPath: ['LearningPaths', 'LearningPath'],
              _request: request,

              /**
               * DELETE an existing learningpath from this specific user, removing them from the learning path
               *
               * @param {object} [params] Query parameters
               */
              apiDelete
            };
          }
        },

        /**
         * Access to this specific user's assigned courses
         */
        courses: {
          _endpoint: ['users', userId, 'courses'],
          _resPath: ['Courses', 'Course'],
          _reqPath: ['Courses', 'Course'],
          _request: request,

          /**
           * GET course data for all the courses that this specific user has been assigned
           *
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with an array of course data objects
           */
          get,
          /**
           * POST an existing course to this specific user, assigning it to them
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post,

          /**
           * Access to a specific course for this specific user
           *
           * @param {string} userId The Litmos ID of the course
           */
          id: (courseId) => {
            return {
              _endpoint: ['users', userId, 'courses', courseId],
              _resPath: ['Course'],
              _request: request,

              /**
               * GET details for this specific course for this specific user. The data returned will include the user's
               * course _and_ module progress data
               *
               * @param {object} [params] Query parameters
               *
               * @return {Promise} Promise will resolve with an array with a single course object
               */
              get
            };
          }
        }
      };
    }
  };


  return users;
};

module.exports = generator;
