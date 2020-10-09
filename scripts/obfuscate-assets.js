'use strict';
/*
 * This test helper assists with obfuscating assets taken directly from Litmos
 *
 * Usage:
 * Pass in the asset name as the first argument, this helper will find the asset
 * in the `test/assets` directory and replace all emails with obfuscated versions
 */

const fs = require('fs');
const path = require('path');

/**
 * Regex for emails taken directly from https://emailregex.com/
 */
// eslint-disable-next-line max-len, no-useless-escape
const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

const processEmails = () => {
  // Create a map for each unique email
  const emailMap = {};
  emailArr.forEach((email) => {
    // Do nothing if we have already mapped this email
    if (emailMap[email]) return;

    // Do nothing if this email matches the obfuscation pattern already
    if (/test[0-9]+@email\.com/.test(email)) return;

    // Generate a new name for this email
    const newEmail = `test${Object.keys(emailMap).length}@email.com`;

    // Assign map
    emailMap[email] = newEmail;
  });

  // Replace!
  Object.keys(emailMap).forEach((originalEmail) => {
    const newEmail = emailMap[originalEmail];

    // Replace all instances of the original email with the new email
    let newString = assetString;
    while (true) { /* eslint-disable-line no-constant-condition */
      newString = newString.replace(originalEmail, newEmail);

      if (newString !== assetString) {
        assetString = newString;
        continue;
      }

      break;
    }
  });
};

const assetName = process.argv[2];
if (!assetName) throw new Error('An asset name must be provided');

// Get the asset
const assetPathSansExtension = path.join('..', 'assets', assetName);

// Try both .js and .json extensions
let asset;
try {
  asset = require(assetPathSansExtension + '.js');
} catch (e) {
  asset = require(assetPathSansExtension + '.json');
}

// Stringify
let assetString = JSON.stringify(asset);

// Find all the emails
const emailArr = assetString.match(emailRegex);
if (emailArr) processEmails();

// Now obfuscate secrets
const envars = require('../../.env.json');
Object.keys(envars).forEach((varName) => {
  const varValue = envars[varName];

  // Replace all instances of the original email with the new email
  let newString = assetString;
  while (true) { /* eslint-disable-line no-constant-condition */
    newString = newString.replace(varValue, 'SECRET');

    if (newString !== assetString) {
      assetString = newString;
      continue;
    }

    break;
  }
});

// Finally, save the newly obfuscated assets
fs.writeFileSync(path.join(__dirname, assetPathSansExtension + '.json'), assetString);

console.log(require(assetPathSansExtension + '.json'));
