'use strict';

/**
 * This helper function is used to generate user objects for new user creation. There are
 * a lot of possible fields that must be in a very specific order. This generator will ensure
 * proper order, as well as validate entries. See the official "Create User" documentation
 * for information on required fields:
 * https://support.litmos.com/hc/en-us/articles/227734767
 *
 * To set a user's timezone, use one of the Timezone Values defined by Litmos:
 * https://support.litmos.com/hc/en-us/articles/227734707-Timezone-values
 *
 * Notes on specific fields:
 * - The `UserName`, `FirstName`, `LastName`, and `DisableMessages` fields are _required_
 * - If `IsCustomUsername` is set to `false`, and there is no `Email` provided, the `Email` field will
 * be given the same value as the `UserName` field
 * - Take special note of the capitalization of the `IsCustomUsername` field - for this field `Username` is
 * considered to be a single word
 *
 * @param {object} obj Object to generate the new user object from
 *
 * @return {object} Fully generated User object, ready for posting / putting
 */
module.exports.generateUserObject = (obj) => {
  const newObj = {};

  // Validate required elements
  const requiredElements = ['UserName', 'FirstName', 'LastName', 'DisableMessages'];
  const missingElements = [];
  requiredElements.forEach((elementName) => {
    if (typeof obj[elementName] === 'undefined') missingElements.push(elementName);
  });
  if (missingElements.length > 0) throw new Error(`Missing required elements for User creation: ${missingElements.join(', ')}`);

  // Apply the applicable values of obj to the new object one-by-one, in the correct order
  newObj.Id = ''; // ID is ignored
  newObj.UserName = obj.UserName;
  newObj.FirstName = obj.FirstName;
  newObj.LastName = obj.LastName;
  newObj.FullName = ''; // Full name is ignored
  newObj.Email = obj.Email || obj.IsCustomUserName ? '' : obj.UserName;
  newObj.AccessLevel = obj.AccessLevel || 'Learner';
  newObj.DisableMessages = obj.DisableMessages;
  newObj.Active = obj.Active || 'true';
  if (typeof obj.Skype !== 'undefined') newObj.Skype = obj.Skype;
  if (typeof obj.PhoneWork !== 'undefined') newObj.PhoneWork = obj.PhoneWork;
  if (typeof obj.PhoneMobile !== 'undefined') newObj.PhoneMobile = obj.PhoneMobile;
  newObj.LastLogin = ''; // LastLogin is ignored
  newObj.LoginKey = ''; // LoginKey is ignored
  newObj.IsCustomUsername = obj.IsCustomUsername ? obj.IsCustomUsername : 'false';
  if (typeof obj.Password !== 'undefined') newObj.Password = obj.Password;
  newObj.SkipFirstLogin = obj.SkipFirstLogin || 'false';
  newObj.TimeZone = obj.TimeZone || ''; // Defaults to the Org timezone
  if (typeof obj.Street1 !== 'undefined') newObj.Street1 = obj.Street1;
  if (typeof obj.Street2 !== 'undefined') newObj.Street2 = obj.Street2;
  if (typeof obj.City !== 'undefined') newObj.City = obj.City;
  if (typeof obj.State !== 'undefined') newObj.State = obj.State;
  if (typeof obj.PostalCode !== 'undefined') newObj.PostalCode = obj.PostalCode;
  if (typeof obj.Country !== 'undefined') newObj.Country = obj.Country;
  if (typeof obj.CompanyName !== 'undefined') newObj.CompanyName = obj.CompanyName;
  if (typeof obj.JobTitle !== 'undefined') newObj.JobTitle = obj.JobTitle;
  if (typeof obj.CustomField1 !== 'undefined') newObj.CustomField1 = obj.CustomField1;
  if (typeof obj.CustomField2 !== 'undefined') newObj.CustomField2 = obj.CustomField2;
  if (typeof obj.CustomField3 !== 'undefined') newObj.CustomField3 = obj.CustomField3;
  if (typeof obj.CustomField4 !== 'undefined') newObj.CustomField4 = obj.CustomField4;
  if (typeof obj.CustomField5 !== 'undefined') newObj.CustomField5 = obj.CustomField5;
  if (typeof obj.CustomField6 !== 'undefined') newObj.CustomField6 = obj.CustomField6;
  if (typeof obj.CustomField7 !== 'undefined') newObj.CustomField7 = obj.CustomField7;
  if (typeof obj.CustomField8 !== 'undefined') newObj.CustomField8 = obj.CustomField8;
  if (typeof obj.CustomField9 !== 'undefined') newObj.CustomField9 = obj.CustomField9;
  if (typeof obj.CustomField10 !== 'undefined') newObj.CustomField10 = obj.CustomField10;
  if (typeof obj.Culture !== 'undefined') newObj.Culture = obj.Culture;
  if (typeof obj.Brand !== 'undefined') newObj.Brand = obj.Brand;
  if (typeof obj.ManagerId !== 'undefined') newObj.ManagerId = obj.ManagerId;
  if (typeof obj.ManagerName !== 'undefined') newObj.ManagerName = obj.ManagerName;
  if (typeof obj.EnableTextNotification !== 'undefined') newObj.EnableTextNotification = obj.EnableTextNotification;
  if (typeof obj.Website !== 'undefined') newObj.Website = obj.Website;
  if (typeof obj.Twitter !== 'undefined') newObj.Twitter = obj.Twitter;
  if (typeof obj.ExpirationDate !== 'undefined') newObj.ExpirationDate = obj.ExpirationDate;

  return newObj;
};

/**
 * This helper function is used to generate module completion objects. All of the members of these objects
 * must follow a very specific order, and this method should be used to ensure that order
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
module.exports.generateModuleResultObject = (obj) => {
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
