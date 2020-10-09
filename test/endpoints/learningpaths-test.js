'use strict';

const assert = require('assert');

const {isEqual} = require('lodash');

const learningpaths = require('../../lib/endpoints/learningpaths.js');

describe('learningpaths', function() {
  it('should have all expected members', async () => {
    const request = {};
    const actual = learningpaths(request);
    assert.ok(actual.get);
    assert.ok(actual.id('id').get);
    assert.ok(actual.id('id').courses.get);
    assert.ok(actual.id('id').users.get);
  });

  it('should get list of learningpaths', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['learningpaths']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'LearningPaths');
        assert.strictEqual(context._resPath[1], 'LearningPath');
        return 'valid';
      }
    };
    const actual = await learningpaths(request).get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get specific learningpath', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['learningpaths', 'id']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'LearningPath');
        return 'valid';
      }
    };
    const actual = await learningpaths(request).id('id').get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get learningpath courses', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['learningpaths', 'id', 'courses']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        return 'valid';
      }
    };
    const actual = await learningpaths(request).id('id').courses.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get learningpath users', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['learningpaths', 'id', 'users']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await learningpaths(request).id('id').users.get();
    assert.strictEqual(actual, 'valid');
  });
});
