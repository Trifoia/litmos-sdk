'use strict';

const assert = require('assert');

const {isEqual} = require('lodash');

const courses = require('../../lib/endpoints/courses.js');

describe('courses', function() {
  it('should have all expected members', async () => {
    const request = {};
    const actual = courses(request);
    assert.ok(actual.get);
    assert.ok(actual.id('id').get);
    assert.ok(actual.id('id').users.get);
    assert.ok(actual.id('id').modules.get);
  });

  it('should get list of courses', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['courses']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Courses');
        assert.strictEqual(context._resPath[1], 'Course');
        return 'valid';
      }
    };
    const actual = await courses(request).get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get specific course', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['courses', 'id']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Course');
        return 'valid';
      }
    };
    const actual = await courses(request).id('id').get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get course users', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['courses', 'id', 'users']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await courses(request).id('id').users.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should get course modules', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['courses', 'id', 'modules']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Modules');
        assert.strictEqual(context._resPath[1], 'Module');
        return 'valid';
      }
    };
    const actual = await courses(request).id('id').modules.get();
    assert.strictEqual(actual, 'valid');
  });
});
