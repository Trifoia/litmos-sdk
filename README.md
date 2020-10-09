# Litmos SDK
Node.js SDK for the Litmos Learning Management System

Litmos' API documentation can be found here: 
https://support.litmos.com/hc/en-us/articles/227734667-Overview-Developer-API

Additional articles can be found here:
https://support.litmos.com/hc/en-us/sections/206185047-Developer-API

# Disclaimer
This package is **not** maintained by or associated with "SAP Litmos" and is provided as-is

# Usage
This SDK is meant to reflect the actual REST API as closely as possible so that the Litmos API docs themselves can provide guidance on how to use this SDK

First, import and create an instance of the Litmos class with required and optional settings. See [litmos-opts.js](./lib/helpers/litmos-opts.js) for a full list of possible options
``` js
const Litmos = require('litmos-sdk');
const env = require('./.env.json');

const litmosOpts = {
  apiKey: env.LITMOS_API_KEY,
  source: env.LITMOS_SOURCE
};
const litmos = new Litmos(litmosOpts);
```

Once instantiated, method / object chaining is used to access the desired endpoint. This method chain should match the form of the API Endpoint as follows:
``` js
GET users/
// Becomes...
litmos.api.users.get()

GET users/{user-id}
// Becomes...
litmos.api.users.id({user-id}).get()

POST users/{user-id}/learningpaths
// Becomes...
litmos.api.users.id({user-id}).learningpaths.post({Learning path data})
```

All method chains **must** end with a request method. Valid methods are:
``` js
get()     // Performs a GET request on the preceding endpoint
delete()  // Performs a DELETE request on the preceding endpoint
post()    // Performs a POST request on the preceding endpoint. Takes a body to post
put()     // Performs a PUT request on the preceding endpoint. Takes a body to put

```

URL query parameters can also be supplied to all request methods. These parameters should be defined as key-value pairs in a supplied object, as such:
``` js
const params = {
  since: '2019-05-14',
  limit: 20
}
litmos.api.results.modules.get(params);
```

## Async
All request methods are asynchronous - they will return a Promise that is resolved with processed response data from Litmos, or reject with an error. The `await` keyword should be used when processing data:
``` js
// All of these requests will happen one after the other
// Wait for the GET request to succeed before saving the response and continuing
const allUsers = await litmos.api.users.get();

// Wait for the GET request
const allLearningPaths = await litmos.api.learningpaths.get();

// Wait for the POST request
const postRes = await litmos.api.users.id('user-id').learningpaths.post({Id: 'lp-id'});
```
## Pagination
Litmos will only provide a maximum of 1000 elements from any request, to get more elements pagination must be used. The system will automatically determine if pagination is required, and keep paging through responses until all elements are received. This functionality can be disabled by provided a "limit" parameter to the request
``` js
// There are 4231 users
const allUsers = await litmos.api.users.get();
console.log(allUsers.length); // Outputs "4231"

const tenUsers = await litmos.api.users.get({limit: 10});
console.log(tenUsers.length); // Outputs "10"
```

## POST / PUT Requests
When performing a POST or PUT request, the provided data should be a JavaScript object, these object will automatically be wrapped in the required endpoint identifiers before being sent to the appropriate endpoint. For example:

According to the Litmos documentation, the following xml would be used to assign a learning path to a user:
``` xml
<LearningPaths>
  <LearningPath>
    <Id>[LearningPathId1]</Id>
  </LearningPath>
  <LearningPath>
    <Id>[LearningPathId2]</Id>
  </LearningPath>
</LearningPaths>
```

This XML is equivalent to this JSON:
``` json
{
  "LearningPaths": [
    {
      "LearningPath": {
        "Id": "LearningPathId1"
      }
    },
    {
      "LearningPath": {
        "Id": "LearningPathId2"
      }
    }
  ]
}
```

However, when using the SDK to update a learning path, the system already knows what should wrap the data, so the following form would be used:
``` js
const newLps = [
  { Id: 'LearningPathId1' },
  { Id: 'LearningPathId2' }
];
await litmos.api.users.id('user-id').learningpaths.push(newLps);
```
## Helpers
Some operations are especially complicated - in these cases helpers are available that simplify things

### Creating New Users
The requirements for creating new users (`litmos.users.post(data)`) are very precise, and a single misconfigured element can result in a server error. For this reason the `litmos.helpers.generateUser()` method exists to assist with generation of correctly formatted user data. Ex:
``` js
const userOpts = {
  UserName: 'test0@email.com',
  FirstName: 'First',
  LastName: 'Last',
  DisableMessages: true
};
const newUser = litmos.helpers.generateUserObject(userOpts);
const response = await litmos.api.users.post(newUser);
```
# Development Principles
The following principles should be followed when developing this sdk:
- Be aware of dependency usage, and use as few dependencies as possible
- Should mimic the Litmos API closely, while still following js best practices and standards
- Asynchronous operations should be implemented using Native Promises
- All traffic **must** be transmitted over https
- Should use the XML endpoints, and support automatic conversion of js objects to xml
  - The Litmos API only consistently works with XML, JSON support is spotty at best
- Should be fully documented with JSDocs to support intellisense

# Notes on Litmos API Oddities
The Litmos API is not the most consistent API in the world. Documentation is spotty and implementation is inconsistent. Here are some pointers that should help when navigating the API

## Two Different ID Systems
Almost every object in Litmos has two _different_ ids associated with it, the `originalId` which is used for all frontend operations, and the backend `id` which is used for all backend API operations. The only way to match `originalId` values to `id` values is to get a complete list of objects, and check each one for the `originalId`. This must be carefully watched for

## XML vs JSON
The Litmos API documentation claims that both XML and JSON is supported for data transfer. However, this is not the case for _all_ litmos endpoints. Some of the older endpoints do not actually support the JSON data format. As such, only the XML endpoints should ever actually be used when making requests

## Object Key Order
When sending requests via XML, the order of object in the XML document _does_ matter in some cases. This should be kept in mind if encountering bugs despite the presence of all required fields

## More results than expected
According to the API documentation, the maximum number of results that can be returned in a single request is 1000. However, sometimes the API will actually return slightly more than 1000 results, which can lead to problems if unexpected
