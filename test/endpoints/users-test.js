'use strict';

const assert = require('assert');

const {isEqual} = require('lodash');

const users = require('../../lib/endpoints/users.js');

describe('users', function() {
  it('should have all expected members', async () => {
    const request = {};
    const actual = users(request);
    assert.ok(actual.get);
    assert.ok(actual.post);
    assert.ok(actual.details.get);
    assert.ok(actual.id('id').get);
    assert.ok(actual.id('id').put);
    assert.ok(actual.id('id').teams.get);
    assert.ok(actual.id('id').learningpaths.get);
    assert.ok(actual.id('id').learningpaths.post);
    assert.ok(actual.id('id').learningpaths.id('id').apiDelete);
    assert.ok(actual.id('id').courses.get);
    assert.ok(actual.id('id').courses.post);
    assert.ok(actual.id('id').courses.id('id').get);
  });

  it('should get list of all users', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await users(request).get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new user', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['users']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        assert.ok(isEqual(body, [{
          AccessLevel: 'Learner',
          Active: 'true',
          DisableMessages: false,
          Email: 'user@name.com',
          FirstName: 'firstName',
          FullName: '',
          Id: '',
          IsCustomUsername: 'false',
          LastLogin: '',
          LastName: 'lastName',
          LoginKey: '',
          SkipFirstLogin: 'false',
          TimeZone: '',
          UserName: 'user@name.com'
        },
        undefined
        ]));
        return 'valid';
      }
    };
    var actual = await users(request).post({
      UserName: 'user@name.com',
      FirstName: 'firstName',
      LastName: 'lastName',
      DisableMessages: false
    });
    assert.strictEqual(actual, 'valid');
  });

  it('should get user details', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'details']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await users(request).details.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get specific user', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'User');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').get();
    assert.strictEqual(actual, 'valid');
  });

  it('should put update to user', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id']));
        assert.strictEqual(method, 'PUT');
        assert.strictEqual(context._resPath[0], 'User');
        assert.ok(isEqual(body, [{
          AccessLevel: 'Learner',
          Active: 'true',
          DisableMessages: false,
          Email: 'user@name.com',
          FirstName: 'firstName',
          FullName: '',
          Id: '',
          IsCustomUsername: 'false',
          LastLogin: '',
          LastName: 'lastName',
          LoginKey: '',
          SkipFirstLogin: 'false',
          TimeZone: '',
          UserName: 'user@name.com'
        },
        undefined
        ]));
        return 'valid';
      }
    };
    var actual = await users(request).id('id').put({
      UserName: 'user@name.com',
      FirstName: 'firstName',
      LastName: 'lastName',
      DisableMessages: false
    });
    assert.strictEqual(actual, 'valid');
  });

  it('should get user teams', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'teams']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Teams');
        assert.strictEqual(context._resPath[1], 'Team');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').teams.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get user learningpaths', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'learningpaths']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').learningpaths.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new learningpath to a user', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'learningpaths']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await users(request).id('id').learningpaths.post('testBody');
    assert.strictEqual(actual, 'valid');
  });

  it('should delete a learningpath from a user', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'learningpaths', 'lpId']));
        assert.strictEqual(method, 'DELETE');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').learningpaths.id('lpId').apiDelete();
    assert.strictEqual(actual, 'valid');
  });

  it('should get user courses', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'courses']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').courses.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new course to a user', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'courses']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await users(request).id('id').courses;
    const result = await actual.post('testBody');
    assert.strictEqual(result, 'valid');
  });

  it('should get a specific course for a user', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['users', 'id', 'courses', 'courseId']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Course');
        return 'valid';
      }
    };
    const actual = await users(request).id('id').courses.id('courseId').get();
    assert.strictEqual(actual, 'valid');
  });
});
