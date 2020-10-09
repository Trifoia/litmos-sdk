'use strict';

/**
 * This helper function is used to generate module completion objects. All of the members of
 * these objects must follow a very specific order, and this method should be used to ensure
 * that order is maintained
 * https://support.litmos.com/hc/en-us/articles/227734987
 *
 *
 * Notes on specific fields:
 * - The `CourseId`, `UserId`, and `Completed` fields are _required_
 * - The `Completed` field should be a boolean value. All other values should be strings
 * - If an `UpdatedAt` member is not provided, a default value of the current time will be used
 *
 * @param {object} obj Object to generate the module completion object from
 *
 * @return {object} Fully generated module completion object, ready for putting
 */
const generateModuleResult = (obj) => {
  if (!obj) throw new Error('Falsy parameter provided to module result object generation');
  const newObj = {};

  // Validate required elements
  const requiredElements = ['CourseId', 'UserId', 'Completed'];
  const missingElements = [];
  requiredElements.forEach((elementName) => {
    if (typeof obj[elementName] === 'undefined') missingElements.push(elementName);
  });
  if (missingElements.length > 0) throw new Error(`Missing required elements for Module Completion creation: ${missingElements.join(', ')}`);

  newObj.CourseId = obj.CourseId;
  newObj.UserId = obj.UserId;
  if (typeof obj.Score !== 'undefined') newObj.Score = obj.Score;
  newObj.Completed = obj.Completed;
  newObj.UpdatedAt = obj.UpdatedAt || (new Date()).toISOString();
  if (typeof obj.Note !== 'undefined') newObj.Note = obj.Note;

  return newObj;
};

module.exports = generateModuleResult;
