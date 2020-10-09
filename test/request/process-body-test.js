'use strict';

const assert = require('assert');

const processBody = require('../../lib/request/process-body.js');

describe('process-body', function() {
  it('should process single item data', async () => {
    const data = {
      CourseId: 'uBus0kKKaak1',
      UserId: 'w8_XWWRCq7S5xPc4LdjqMw2',
      Score: 100,
      Completed: true,
      UpdatedAt: '2020-10-05T18:29:18.005Z'
    };
    const reqPath = [ 'ModuleResult' ];
    const expected = '<ModuleResult><CourseId>uBus0kKKaak1</CourseId><UserId>w8_XWWRCq7S5xPc4LdjqMw2</UserId><Score>100</Score><Completed>true</Completed><UpdatedAt>2020-10-05T18:29:18.005Z</UpdatedAt></ModuleResult>';

    const actual = processBody(data, reqPath);
    assert.strictEqual(actual, expected);
  });

  it('should process single item data without xml conversion', async () => {
    const data = {
      CourseId: 'uBus0kKKaak1',
      UserId: 'w8_XWWRCq7S5xPc4LdjqMw2',
      Score: 100,
      Completed: true,
      UpdatedAt: '2020-10-05T18:29:18.005Z'
    };
    const reqPath = [ 'ModuleResult' ];

    const actual = processBody(data, reqPath, false);
    assert.strictEqual(actual.ModuleResult.CourseId, data.CourseId);
    assert.strictEqual(actual.ModuleResult.UserId, data.UserId);
    assert.strictEqual(actual.ModuleResult.Score, data.Score);
    assert.strictEqual(actual.ModuleResult.Completed, data.Completed);
    assert.strictEqual(actual.ModuleResult.UpdatedAt, data.UpdatedAt);
  });

  it('should process multi item data', async () => {
    const data = [
      {
        UserName: 'user1@email.com',
        FirstName: 'First',
        LastName: 'Last',
        DisableMessages: false
      },
      {
        UserName: 'user2@email.com',
        FirstName: 'First',
        LastName: 'Last',
        DisableMessages: false
      }
    ];
    const reqPath = [ 'Users', 'User' ];
    const expected = '<Users><User><UserName>user1@email.com</UserName><FirstName>First</FirstName><LastName>Last</LastName><DisableMessages>false</DisableMessages></User></Users><Users><User><UserName>user2@email.com</UserName><FirstName>First</FirstName><LastName>Last</LastName><DisableMessages>false</DisableMessages></User></Users>';

    const actual = processBody(data, reqPath);
    assert.strictEqual(actual, expected);
  });

  it('should process multi item data without xml conversion', async () => {
    const data = [
      {
        UserName: 'user1@email.com',
        FirstName: 'First',
        LastName: 'Last',
        DisableMessages: false
      },
      {
        UserName: 'user2@email.com',
        FirstName: 'First',
        LastName: 'Last',
        DisableMessages: false
      }
    ];
    const reqPath = [ 'Users', 'User' ];

    const actual = processBody(data, reqPath, false);
    assert.strictEqual(actual.Users[0].User.UserName, data[0].UserName);
    assert.strictEqual(actual.Users[0].User.FirstName, data[0].FirstName);
    assert.strictEqual(actual.Users[0].User.LastName, data[0].LastName);
    assert.strictEqual(actual.Users[0].User.DisableMessages, data[0].DisableMessages);
    assert.strictEqual(actual.Users[1].User.UserName, data[1].UserName);
    assert.strictEqual(actual.Users[1].User.FirstName, data[1].FirstName);
    assert.strictEqual(actual.Users[1].User.LastName, data[1].LastName);
    assert.strictEqual(actual.Users[1].User.DisableMessages, data[1].DisableMessages);
  });
});
