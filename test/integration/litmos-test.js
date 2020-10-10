'use strict';

const assert = require('assert');

const itSlowly = require('../test-utils/it-slowly.js');

const config = require('../../config.js');
const LitmosSDK = require('../../litmos.js');

const litmos = new LitmosSDK({
  apiKey: config.litmosOpts.apiKey,
  source: config.litmosOpts.source
});

/**
 * These integration tests ensure that the litmos sdk can still communicate as expected with
 * the Litmos API and that the Litmos API is still responding as expected
 */
describe('litmos integration', function() {
  this.timeout(100000);
  let courseId, learningpathId, teamId, userId;
  let lastRequestCount = 0;

  it('should have expected interface', async () => {
    assert.ok(litmos.api.users);
    assert.ok(litmos.api.courses);
    assert.ok(litmos.api.results);
    assert.ok(litmos.api.teams);
    assert.ok(litmos.api.learningpaths);
    assert.strictEqual(typeof litmos.setEndpoint, 'function');
    assert.strictEqual(typeof litmos.helpers.generateUserObject, 'function');
    assert.strictEqual(typeof litmos.helpers.generateModuleResultObject, 'function');
    assert.strictEqual(litmos.requestCount, 0);
    assert.ok(litmos.opts.apiKey);
    assert.ok(litmos.opts.source);
    assert.ok(litmos.opts.rateLimit);
    assert.ok(litmos.opts.verbose);
  });

  it('should be able to generate two sdk instances with different opts', async () => {
    const opts1 = {
      apiKey: 'testKey1',
      source: 'testSource1'
    };
    const opts2 = {
      apiKey: 'testKey2',
      source: 'testSource2'
    };

    const sdk1 = new LitmosSDK(opts1);
    const sdk2 = new LitmosSDK(opts2);

    assert.strictEqual(sdk1.opts.apiKey, opts1.apiKey);
    assert.strictEqual(sdk1.opts.source, opts1.source);
    assert.strictEqual(sdk2.opts.apiKey, opts2.apiKey);
    assert.strictEqual(sdk2.opts.source, opts2.source);
  });

  itSlowly('should complete module', async () => {
    const opts = {
      UserId: 'w8_XWWRCq7S5xPc4LdjqMw2',
      CourseId: 'uBus0kKKaak1',
      Score: 100,
      Completed: true
    };
    const result = await litmos.api.results.modules.id('EeuhXpY_jVw1').put(opts);

    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 0);
    assert.strictEqual(litmos.requestCount, 1);
    lastRequestCount = litmos.requestCount;
  });

  let courses;
  itSlowly('should get all courses', async () => {
    courses = await litmos.api.courses.get();
    courseId = courses[0].Id;
    courses.forEach((course) => {
      const keys = Object.keys(course);
      assert.ok(keys.includes('Id'));
      assert.ok(keys.includes('Code'));
      assert.ok(keys.includes('Name'));
      assert.ok(keys.includes('Active'));
      assert.ok(keys.includes('ForSale'));
      assert.ok(keys.includes('OriginalId'));
      assert.ok(keys.includes('Description'));
      assert.ok(keys.includes('EcommerceShortDescription'));
      assert.ok(keys.includes('EcommerceLongDescription'));
      assert.ok(keys.includes('CourseCodeForBulkImport'));
      assert.ok(keys.includes('Price'));
      assert.ok(keys.includes('AccessTillDate'));
      assert.ok(keys.includes('AccessTillDays'));
      assert.ok(keys.includes('CourseTeamLibrary'));
    });

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should be able to get courses from a second account', async () => {
    const sdk2 = new LitmosSDK({
      apiKey: config.debug.apiKey2,
      source: config.litmosOpts.source
    });
    const actual = await sdk2.api.courses.get();
    actual.forEach((course) => {
      const keys = Object.keys(course);
      assert.ok(keys.includes('Id'));
      assert.ok(keys.includes('Code'));
      assert.ok(keys.includes('Name'));
      assert.ok(keys.includes('Active'));
      assert.ok(keys.includes('ForSale'));
      assert.ok(keys.includes('OriginalId'));
      assert.ok(keys.includes('Description'));
      assert.ok(keys.includes('EcommerceShortDescription'));
      assert.ok(keys.includes('EcommerceLongDescription'));
      assert.ok(keys.includes('CourseCodeForBulkImport'));
      assert.ok(keys.includes('Price'));
      assert.ok(keys.includes('AccessTillDate'));
      assert.ok(keys.includes('AccessTillDays'));
      assert.ok(keys.includes('CourseTeamLibrary'));

      // A course with this ID should not exist in the first courses array
      const found = courses.find(firstCourse => firstCourse.Id === course.Id);
      assert.strictEqual(typeof found, 'undefined');
    });
  });

  itSlowly('should not increment request count of first sdk when second sdk is used', async () => {
    assert.strictEqual(litmos.requestCount, lastRequestCount);
  });

  itSlowly('should get specific course', async () => {
    const actual = (await litmos.api.courses.id(courseId).get())[0];
    const keys = Object.keys(actual);
    assert.ok(keys.includes('Id'));
    assert.ok(keys.includes('Code'));
    assert.ok(keys.includes('Name'));
    assert.ok(keys.includes('Active'));
    assert.ok(keys.includes('ForSale'));
    assert.ok(keys.includes('OriginalId'));
    assert.ok(keys.includes('Description'));
    assert.ok(keys.includes('EcommerceShortDescription'));
    assert.ok(keys.includes('EcommerceLongDescription'));
    assert.ok(keys.includes('CourseCodeForBulkImport'));
    assert.ok(keys.includes('Price'));
    assert.ok(keys.includes('AccessTillDate'));
    assert.ok(keys.includes('AccessTillDays'));
    assert.ok(keys.includes('CourseTeamLibrary'));
    assert.ok(keys.includes('Tags'));

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get all learningpaths', async () => {
    const actual = await litmos.api.learningpaths.get();
    learningpathId = actual[0].Id;
    actual.forEach((learningpath) => {
      const keys = Object.keys(learningpath);
      assert.ok(keys.includes('Id'));
      assert.ok(keys.includes('Name'));
      assert.ok(keys.includes('Description'));
      assert.ok(keys.includes('Active'));
      assert.ok(keys.includes('OriginalId'));
      assert.ok(keys.includes('ForSale'));
      assert.ok(keys.includes('Price'));
      assert.ok(keys.includes('EcommerceShortDescription'));
      assert.ok(keys.includes('EcommerceLongDescription'));
      assert.ok(keys.includes('AccessTillDate'));
      assert.ok(keys.includes('AccessTillDays'));
      assert.ok(keys.includes('IsEquivalency'));
      assert.ok(keys.includes('LearningPathTeamLibrary'));
    });

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get specific learningpath', async () => {
    const actual = (await litmos.api.learningpaths.id(learningpathId).get())[0];
    const keys = Object.keys(actual);
    assert.ok(keys.includes('Id'));
    assert.ok(keys.includes('Name'));
    assert.ok(keys.includes('Description'));
    assert.ok(keys.includes('Active'));
    assert.ok(keys.includes('OriginalId'));
    assert.ok(keys.includes('ForSale'));
    assert.ok(keys.includes('Price'));
    assert.ok(keys.includes('EcommerceShortDescription'));
    assert.ok(keys.includes('EcommerceLongDescription'));
    assert.ok(keys.includes('AccessTillDate'));
    assert.ok(keys.includes('AccessTillDays'));
    assert.ok(keys.includes('IsEquivalency'));
    assert.ok(keys.includes('LearningPathTeamLibrary'));

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get all teams', async () => {
    const actual = await litmos.api.teams.get();
    teamId = actual[0].Id;
    actual.forEach((learningpath) => {
      const keys = Object.keys(learningpath);
      assert.ok(keys.includes('Id'));
      assert.ok(keys.includes('Name'));
      assert.ok(keys.includes('TeamCodeForBulkImport'));
      assert.ok(keys.includes('ParentTeamId'));
    });

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get specific team', async () => {
    const actual = (await litmos.api.teams.id(teamId).get())[0];
    const keys = Object.keys(actual);
    assert.ok(keys.includes('Id'));
    assert.ok(keys.includes('Name'));
    assert.ok(keys.includes('Description'));
    assert.ok(keys.includes('ParentTeamId'));
    assert.ok(keys.includes('TeamCodeForBulkImport'));

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get all users', async () => {
    const actual = await litmos.api.users.get();
    userId = actual[0].Id;

    // There should be more than 1500 users in this account
    assert.ok(actual.length > 1500);
    actual.forEach((user) => {
      const keys = Object.keys(user);
      assert.ok(keys.includes('Id'));
      assert.ok(keys.includes('UserName'));
      assert.ok(keys.includes('FirstName'));
      assert.ok(keys.includes('LastName'));
      assert.ok(keys.includes('Active'));
      assert.ok(keys.includes('Email'));
      assert.ok(keys.includes('AccessLevel'));
      assert.ok(keys.includes('Brand'));
    });

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });

  itSlowly('should get specific user', async () => {
    const actual = (await litmos.api.users.id(userId).get())[0];
    const keys = Object.keys(actual);
    assert.ok(keys.includes('Id'));
    assert.ok(keys.includes('UserName'));
    assert.ok(keys.includes('FirstName'));
    assert.ok(keys.includes('LastName'));
    assert.ok(keys.includes('FullName'));
    assert.ok(keys.includes('Email'));
    assert.ok(keys.includes('AccessLevel'));
    assert.ok(keys.includes('DisableMessages'));
    assert.ok(keys.includes('Active'));
    assert.ok(keys.includes('Skype'));
    assert.ok(keys.includes('PhoneWork'));
    assert.ok(keys.includes('PhoneMobile'));
    assert.ok(keys.includes('LastLogin'));
    assert.ok(keys.includes('LoginKey'));
    assert.ok(keys.includes('IsCustomUsername'));
    assert.ok(keys.includes('Password'));
    assert.ok(keys.includes('SkipFirstLogin'));
    assert.ok(keys.includes('TimeZone'));
    assert.ok(keys.includes('SalesforceId'));
    assert.ok(keys.includes('OriginalId'));
    assert.ok(keys.includes('Street1'));
    assert.ok(keys.includes('Street2'));
    assert.ok(keys.includes('City'));
    assert.ok(keys.includes('State'));
    assert.ok(keys.includes('PostalCode'));
    assert.ok(keys.includes('Country'));
    assert.ok(keys.includes('CompanyName'));
    assert.ok(keys.includes('JobTitle'));
    assert.ok(keys.includes('CustomField1'));
    assert.ok(keys.includes('CustomField2'));
    assert.ok(keys.includes('CustomField3'));
    assert.ok(keys.includes('CustomField4'));
    assert.ok(keys.includes('CustomField5'));
    assert.ok(keys.includes('CustomField6'));
    assert.ok(keys.includes('CustomField7'));
    assert.ok(keys.includes('CustomField8'));
    assert.ok(keys.includes('CustomField9'));
    assert.ok(keys.includes('CustomField10'));
    assert.ok(keys.includes('Culture'));
    assert.ok(keys.includes('SalesforceContactId'));
    assert.ok(keys.includes('SalesforceAccountId'));
    assert.ok(keys.includes('CreatedDate'));
    assert.ok(keys.includes('Points'));
    assert.ok(keys.includes('Brand'));
    assert.ok(keys.includes('ManagerId'));
    assert.ok(keys.includes('ManagerName'));
    assert.ok(keys.includes('EnableTextNotification'));
    assert.ok(keys.includes('Website'));
    assert.ok(keys.includes('Twitter'));
    assert.ok(keys.includes('ExpirationDate'));
    assert.ok(keys.includes('JobRole'));

    assert.ok(litmos.requestCount > lastRequestCount);
    lastRequestCount = litmos.requestCount;
  });
});
