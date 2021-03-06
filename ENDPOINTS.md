# Litmos API Endpoints
This document is meant to be a comprehensive list of available Litmos API endpoints - according to their API documentation

The documentation can be found [here](https://support.litmos.com/hc/en-us/articles/227734667-Overview-Developer-API)

## Required Endpoints
These are the endpoints that we need to implement for full functionality of our current systems
```
/users                - get; post
  /details              - get
  /{userId OR username} - get; put
    /teams                - get
    /learningpaths        - get; post
    /courses              - get; post
      /{courseId}           - get

/courses        - get
  /{courseId}     - get
    /users          - get
    /modules        - get

/results    - NA
  /modules    - NA
    /{moduleId} - post

/teams          - get; post
  /{teamId}       - get; put
    /courses        - get; post
    /teams          - get; post
    /learningpaths  - get; post
    /users          - get; post

/learningpaths  - get
  /{lpId}         - get
    /courses        - get
    /users          - get
```

## Comprehensive List
```
/users                - get; post
  /details              - get
  /{userId OR username} - get; put; delete
    /usercustomfields     - get; post
    /teams                - get; delete
    /gamificationsummary  - get
    /gamificationdetails  - get
    /gamificationreset    - put
    /badges               - get
    /learningpaths        - get; post
      /{lpId}               - delete
    /courses              - get; post
      /{courseId}           - get; delete
        /reset                - put

/courses        - get
  /{courseId}     - get
    /users          - get
    /events         - NA
      /{eventId}      - delete
    /modules        - get
      /ilt            - get
      /{moduleId}     - NA
        /registration   - get
        /sessions       - get; post
          /{sessionId}    - get; put; delete
            /attendance   - get
            /rollcall     - get; post
            /users          - NA
              /{userId}       - NA
                /register       - post
        /sessiondays    - NA
          /{sessionDayId} - NA
            /attended     - NA
              /{attended}   - post
            /users          - NA
              /{userId}       - NA
                /attended       - NA
                  /{attended}     - post

/results    - NA
  /details    - get
  /modules    - NA
    /{moduleId} - post

/teams                - get; post
  /{teamId}             - get; put; delete
    /courses              - get; post; delete
    /teams                - get; post
    /gamificationdetails  - get
    /learningpaths        - get; post; delete
    /users                - get; post
      /{userId}             - delete
    /leaders              - get
      /{userId}             - put; delete
    /admins               - get
      /{userId}             - put; delete

/learningpaths  - get
  /{lpId}         - get
    /courses        - get
    /users          - get

/sessions - NA
  /future   - get

/instructors    - get
  /{instructorId} - NA
    /sessions       - get
```
