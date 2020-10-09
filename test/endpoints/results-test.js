'use strict';

const assert = require('assert');

const {isEqual} = require('lodash');

const results = require('../../lib/endpoints/results.js');

describe('results', function() {
  it('should have all expected members', async () => {
    const request = {};
    const actual = results(request);
    assert.ok(actual.details.get);
    assert.ok(actual.modules.id('id').put);
  });

  it('should get result details', async () => {
    const request = {
      sendRequest: (context, method) => {
        assert.ok(isEqual(context._endpoint, ['results', 'details']));
        assert.strictEqual(method, 'GET');
        assert.strictEqual(context._resPath[0], 'Users');
        assert.strictEqual(context._resPath[1], 'User');
        return 'valid';
      }
    };
    const actual = await results(request).details.get();
    assert.strictEqual(actual, 'valid');
  });

  it('should put module result details', async () => {
    const request = {
      sendRequest: (context, method, body) => {
        assert.ok(isEqual(context._endpoint, ['results', 'modules', 'id']));
        assert.strictEqual(method, 'PUT');
        assert.strictEqual(context._resPath.length, 0);
        assert.ok(isEqual(body, [
          {
            Completed: true,
            CourseId: 'courseId',
            UpdatedAt: '2020-10-05T19:33:52.699Z',
            UserId: 'userId'
          },
          undefined
        ]));
        return 'valid';
      }
    };
    const actual = await results(request).modules.id('id').put({
      CourseId: 'courseId',
      UserId: 'userId',
      Completed: true,
      UpdatedAt: '2020-10-05T19:33:52.699Z'
    });
    assert.strictEqual(actual, 'valid');
  });
});
