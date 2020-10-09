'use strict';

const xml = require('../utils/xml.js');

// We need to create an object that will resolve to the following XML patterns. "User" is
// used as a placeholder
/*
Multi-Object XML:
  <Users>
    <User>
      <Id>Some id</Id>
    </User>
    <User>
      <Id>Some other Id</Id>
    </User>
  </Users>

Multi-Object JSON:
  {
    Users: [
      {
        User: {
          Id: Some id
        }
      },
      {
        User: {
          Id: Some other Id
        }
      }
    ]
  }

Single Object XML:
  <User>
    <Id>Some id</Id>
  </User>

Single Object JSON:
  User: {
    Id: Some id
  }
*/
/**
 * Takes raw data for a request body, and the request path for that data, and fully converts
 * the data into a request body ready for delivery
 * 
 * @param {object|object[]} data Data to construct the body from
 * @param {string[]} reqPath The endpoint identifiers that label the data in the body
 * @param {boolean} [toXml] If the body should be converted to xml. Default: true 
 */
const processBody = (data, reqPath, toXml = true) => {
  const body = {};
  if (!Array.isArray(data)) data = [data];
  switch (reqPath.length) {
  case 1:
    body[reqPath[0]] = data[0];
    break;
  case 2:
    body[reqPath[0]] = [];
    data.forEach((item) => {
      const subItem = {};
      subItem[reqPath[1]] = item;
      body[reqPath[0]].push(subItem);
    });
    break;
  }

  if (toXml) return xml.toXML(body);
  return body;
};

module.exports = processBody;
