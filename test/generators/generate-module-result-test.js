'use strict';

const assert = require('assert');

const generateModuleResultObject = require('../../lib/generators/generate-module-result.js');
const xml = require('../../lib/utils/xml.js');

describe('generate-module-result-object', function() {
  const moduleResultSeed = {
    CourseId: 'courseId',
    UserId: 'userId',
    Completed: true,
    UpdatedAt: '2020-10-05T05:06:10.460Z'
  };
  const moduleResultXml = '<CourseId>courseId</CourseId><UserId>userId</UserId><Completed>true</Completed><UpdatedAt>2020-10-05T05:06:10.460Z</UpdatedAt>';

  it('should fail with inadequate data', () => {
    try {
      generateModuleResultObject({});
    } catch (e) {
      assert.strictEqual(e.message, 'Missing required elements for Module Completion creation: CourseId, UserId, Completed');
    }
  });

  it('should succeed without "UpdatedAt" value', async () => {
    const newModuleResult = generateModuleResultObject({
      CourseId: 'courseId',
      UserId: 'userId',
      Completed: true,
    });

    assert.strictEqual(newModuleResult.CourseId, moduleResultSeed.CourseId);
    assert.strictEqual(newModuleResult.UserId, moduleResultSeed.UserId);
    assert.strictEqual(newModuleResult.Completed, moduleResultSeed.Completed);
    assert.strictEqual(typeof newModuleResult.UpdatedAt, 'string');
  });

  it('should succeed to generate object', () => {
    const newModuleResult = generateModuleResultObject(moduleResultSeed);

    assert.strictEqual(newModuleResult.CourseId, moduleResultSeed.CourseId);
    assert.strictEqual(newModuleResult.UserId, moduleResultSeed.UserId);
    assert.strictEqual(newModuleResult.Completed, moduleResultSeed.Completed);
    assert.strictEqual(newModuleResult.UpdatedAt, moduleResultSeed.UpdatedAt);
  });

  it('should correctly convert to XML', () => {
    const newModuleResult = generateModuleResultObject(moduleResultSeed);

    assert.strictEqual(xml.toXML(newModuleResult), moduleResultXml);
  });

  it('should correctly convert to XML when seed object is out of order', () => {
    const newModuleResult = generateModuleResultObject({
      Completed: true,
      UpdatedAt: '2020-10-05T05:06:10.460Z',
      UserId: 'userId',
      CourseId: 'courseId'
    });

    assert.strictEqual(xml.toXML(newModuleResult), moduleResultXml);
  });
});
