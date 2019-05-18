'use strict';

/*
  The `valid-jsdoc` rule has to be ignored so that IntelliSense documentation can properly chain past the "id" methods.
  If the `@return` value is defined for these methods the documentation chain breaks
*/
/* eslint-disable valid-jsdoc */
const get = require('../request/get.js');
const post = require('../request/post.js');
const put = require('../request/put.js');

// Endpoints to Support:
// /teams          - get; post
//   /{teamId}       - get; put
//     /courses        - get; post
//     /teams          - get; post
//     /learningpaths  - get; post
//     /users          - get; post

/**
 *  Generator
 *
 * @param {object} request Previously instantiated request module
 */
const generator = function(request) {
  /**
   * Starting point for the 'teams' API paths
   */
  const teams = {
    _endpoint: ['teams'],
    _resPath: ['Teams', 'Team'],
    _reqPath: ['Team'],
    _request: request,

    /**
     * GET basic information for all teams
     *
     * @param {object} [params] Query parameters
     * @return {Promise} Promise will resolve with team data
     */
    get,
    /**
     * POST a new team
     *
     * @param {object} body JS Object body for the post request
     * @param {object} [params] Query parameters
     *
     * @return {Promise} Promise will resolve with success or reject with failure
     */
    post,

    /**
     * Access to data for a specific team
     *
     * @param {string} teamId ID for the team
     */
    id: function(teamId) {
      return {
        _endpoint: ['teams', teamId],
        _resPath: ['Team'],
        _reqPath: ['Team'],
        _request: request,

        /**
         * GET detailed information for this specific team
         *
         * @param {object} [params] Query parameters
         * @return {Promise} Promise will resolve with team data
         */
        get,
        /**
         * PUT an update to this specific team
         *
         * @param {object} body JS Object body for the post request
         * @param {object} [params] Query parameters
         *
         * @return {Promise} Promise will resolve with success or reject with failure
         */
        put,

        /**
         * Access to this specific team's course data
         */
        courses: {
          _endpoint: ['teams', teamId, 'courses'],
          _resPath: ['Courses', 'Course'],
          _reqPath: ['Courses', 'Course'],
          _request: request,

          /**
           * GET information for all courses associated with this team
           *
           * @param {object} [params] Query parameters
           * @return {Promise} Promise will resolve with course data
           */
          get,
          /**
           * POST a new course to the team
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post
        },
        /**
         * Access to this specific team's sub-teams
         */
        teams: {
          _endpoint: ['teams', teamId, 'teams'],
          _resPath: ['Teams', 'Team'],
          _reqPath: ['Team'],
          _request: request,

          /**
           * GET information for all sub-teams associated with this team
           *
           * @param {object} [params] Query parameters
           * @return {Promise} Promise will resolve with team data
           */
          get,
          /**
           * POST a new sub-team to this team
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post
        },
        /**
         * Access to this specific team's assigned learning paths
         */
        learningpaths: {
          _endpoint: ['teams', teamId, 'learningpaths'],
          _resPath: ['LearningPaths', 'LearningPath'],
          _reqPath: ['LearningPaths', 'LearningPath'],
          _request: request,

          /**
           * GET information for all learning paths assigned to this team
           *
           * @param {object} [params] Query parameters
           * @return {Promise} Promise will resolve with learning path data
           */
          get,
          /**
           * POST a learning path to assign to this team
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post
        },
        /**
         * Access to this specific team's users
         */
        users: {
          _endpoint: ['teams', teamId, 'users'],
          _resPath: ['Users', 'User'],
          _reqPath: ['Users', 'User'],
          _request: request,

          /**
           * GET information for all users assigned to this team
           *
           * @param {object} [params] Query parameters
           * @return {Promise} Promise will resolve with user data
           */
          get,
          /**
           * POST a user to assign to this team
           *
           * @param {object} body JS Object body for the post request
           * @param {object} [params] Query parameters
           *
           * @return {Promise} Promise will resolve with success or reject with failure
           */
          post
        }
      };
    }
  };

  return teams;
};

module.exports = generator;
