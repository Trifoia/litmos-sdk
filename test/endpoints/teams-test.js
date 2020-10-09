'use strict';

const assert = require('assert');

const {isEqual} = require('lodash');

const teams = require('../../lib/endpoints/teams.js');

describe('teams', function() {
  it('should have all expected members', async () => {
    const request = {};
    const actual = teams(request);
    assert.ok(actual.get);
    assert.ok(actual.post);
    assert.ok(actual.id('id').get);
    assert.ok(actual.id('id').put);
    assert.ok(actual.id('id').courses.get);
    assert.ok(actual.id('id').courses.post);
    assert.ok(actual.id('id').teams.get);
    assert.ok(actual.id('id').teams.post);
    assert.ok(actual.id('id').learningpaths.get);
    assert.ok(actual.id('id').learningpaths.post);
    assert.ok(actual.id('id').users.get);
    assert.ok(actual.id('id').users.post);
  });

  it('should get list of all teams', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Teams');
        assert.strictEqual(context._resPath[1], 'Team');
        return 'valid';
      }
    };
    const actual = await teams(request).get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Teams');
        assert.strictEqual(context._resPath[1], 'Team');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).post('testBody');
    assert.strictEqual(actual, 'valid');
  });

  it('should get specific team', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Team');
        return 'valid';
      }
    };
    const actual = await teams(request).id('id').get();
    assert.strictEqual(actual, 'valid');
  });

  it('should put update to team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id']));
        assert.strictEqual(method, 'PUT');
        assert.strictEqual(context._resPath[0], 'Team');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).id('id').put('testBody');
    assert.strictEqual(actual, 'valid');
  });

  it('should get team courses', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'courses']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        return 'valid';
      }
    };
    const actual = await teams(request).id('id').courses.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new course to a team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'courses']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).id('id').courses.post('testBody');
    assert.strictEqual(actual, 'valid');
  });

  it('should get team teams', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'teams']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Teams');
        assert.strictEqual(context._resPath[1], 'Team');
        return 'valid';
      }
    };
    const actual = await teams(request).id('id').teams.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new team to a team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'teams']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Teams');
        assert.strictEqual(context._resPath[1], 'Team');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).id('id').teams.post('testBody');
    assert.strictEqual(actual, 'valid');
  });

  it('should get team learningpaths', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'learningpaths']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        return 'valid';
      }
    };
    const actual = await teams(request).id('id').learningpaths.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new learningpath to a team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'learningpaths']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).id('id').learningpaths;
    const result = await actual.post('testBody');
    assert.strictEqual(result, 'valid');
  });

  it('should get team users', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'users']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await teams(request).id('id').users.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should post a new user to a team', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['teams', 'id', 'users']));
        assert.strictEqual(method, 'POST');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        assert.strictEqual(body, 'testBody');
        return 'valid';
      }
    };
    var actual = await teams(request).id('id').users;
    const result = await actual.post('testBody');
    assert.strictEqual(result, 'valid');
  });
});
