# node-http-error

[![Greenkeeper badge](https://badges.greenkeeper.io/allanchau/node-http-error.svg)](https://greenkeeper.io/)

[![Build Status](https://img.shields.io/travis/allanchau/node-http-error.svg)](https://travis-ci.org/allanchau/node-http-error)
[![npm](https://img.shields.io/npm/v/allanchau-http-error.svg)](https://www.npmjs.com/package/allanchau-http-error)

Simple Express HTTP error handler.

This library follows the [Microsoft API](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#51-errors) guidelines for HTTP error responses. While defaults are provided for `code` and `message` (they are required), you should provide your own.

For an example of a compliant response, see the  [error-condition-responses](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses) section of the guidelines.

## Features

- Express HTTP error handler.
- [Microsoft API](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#51-errors) compliant error response.

## Installation

This package is available on [NPM](https://www.npmjs.com/package/allanchau-http-error):

  ```shell
  $ npm install allanchau-http-error
  ```

## Usage

A simple example:

```javascript
// App.
const app = require('express');
const HttpError = require('allanchau-http-error');

app.get('/', (req, res, next) => {

  return next(new HttpError(400, {
    code: 'BadArgument',
    message: 'Previous passwords may not be reused',
  })

});

app.use(HttpError.errorHandler);

// JSON response.
// 400 Bad Request
{
  "error": {
    "code": "BadArgument",
    "message": "Previous passwords may not be reused"
  }
}
```

Example of "innererror":

```javascript
app.get('/', (req, res, next) => {

  return next(new HttpError(400, {
    code: 'BadArgument',
    message: 'Previous passwords may not be reused',
    target: 'password',
    innererror: [
      code: 'PasswordDoesNotMeetPolicy',
      minLength: '6',
      maxLength: '64',
      characterTypes: ['lowerCase', 'upperCase', 'number', 'symbol'],
      minDistinctCharacterTypes: '2',
      innererror: {
        code: 'PasswordReuseNotAllowed'
      }
    ],
  })

});

// JSON response.
// 400 Bad Request
{
  "error": {
    "code": "BadArgument",
    "message": "Previous passwords may not be reused",
    "target": "password",
    "innererror": {
      "code": "PasswordError",
      "innererror": {
        "code": "PasswordDoesNotMeetPolicy",
        "minLength": "6",
        "maxLength": "64",
        "characterTypes": ["lowerCase","upperCase","number","symbol"],
        "minDistinctCharacterTypes": "2",
        "innererror": {
          "code": "PasswordReuseNotAllowed"
        }
      }
    }
  }
}
```

Example of "details":

```javascript
app.get('/', (req, res, next) => {

  return next(new HttpError(400, {
    code: 'BadArgument',
    message: 'Multiple errors in ContactInfo data',
    target: 'ContactInfo',
    details: [
      {
        code: 'NullValue',
        target: 'PhoneNumber',
        message: 'Phone number must not be null',
      },
      {
        code: 'NullValue',
        target: 'LastName',
        message: 'Last name must not be null',
      },
      {
        code: 'MalformedValue',
        target: 'Address',
        message: 'Address is not valid',
      }
    ],
  })

});

// JSON response.
// 400 Bad Request
{
  "error": {
    "code": "BadArgument",
    "message": "Multiple errors in ContactInfo data",
    "target": "ContactInfo",
    "details": [
      {
        "code": "NullValue",
        "target": "PhoneNumber",
        "message": "Phone number must not be null"
      },
      {
        "code": "NullValue",
        "target": "LastName",
        "message": "Last name must not be null"
      },
      {
        "code": "MalformedValue",
        "target": "Address",
        "message": "Address is not valid"
      }
    ]
  }
}
```
