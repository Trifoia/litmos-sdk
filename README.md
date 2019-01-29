# Litmos SDK
Node.js SDK for the Litmos Learning Management System

Litmos' API documentation can be found here: 
https://support.litmos.com/hc/en-us/articles/227734667-Overview-Developer-API

Additional articles can be found here:
https://support.litmos.com/hc/en-us/sections/206185047-Developer-API

# PRE-RELEASE DEVELOPMENT
WARNING: Expect major changes in minor version updates (0.x.0) until version 1.0.0 is reached. This SDK is currently **unstable**

# Development Principles
The following principles should be followed when developing this sdk:
- Be aware of dependency usage, and use as few dependencies as possible
- Should mimic the Litmos API closely, while still following js best practices and standards
- Asynchronous operations should be implemented using Native Promises
- All traffic **must** be transmitted over https
- Should use the XML endpoints, and support automatic conversion of js objects to xml
  - The Litmos API only consistently works with XML, JSON support is spotty at best
- Should be fully documented with JSDocs
- Should be fully unit tested

# Notes on Litmos API Oddities
The Litmos API is not the most consistent API in the world. Documentation is spotty and implementation is inconsistent. Here are some pointers that should help when navigating the API

## Two Different ID Systems
Almost every object in Litmos has two _different_ ids associated with it, the `originalId` which is used for all frontend operations, and the backend `id` which is used for all backend API operations. The only way to match `originalId` values to `id` values is to get a complete list of objects, and check each one for the `originalId`. This must be carefully watched for

## XML vs JSON
The Litmos API documentation claims that both XML and JSON is supported for data transfer. However, this is not the case for _all_ litmos endpoints. Some of the older endpoints do not actually support the JSON data format. As such, only the XML endpoints should ever actually be used when making requests

## Object Key Order
When sending requests via XML, the order of object in the XML document _does_ matter in some cases, despite being considered "unordered" according to the xml specification. This should be kept in mind if encountering bugs despite the presence of all required fields
