# node-http-error

[![Build Status](https://img.shields.io/travis/allanchau/node-http-error.svg)](https://travis-ci.org/allanchau/node-http-error)
[![npm](https://img.shields.io/npm/v/allanchau-http-error.svg)](https://www.npmjs.com/package/allanchau-http-error)

Simple Express HTTP error handler.

## Features

- Express HTTP error handler.
- JSON response.

## Installation

This package is available on [NPM](https://www.npmjs.com/package/allanchau-http-error):

  ```shell
  $ npm install allanchau-http-error
  ```

## Usage

```javascript
// App.
const app = require('express');
const HttpError = require('allanchau-http-error');

app.get('/', (req, res, next) => throw new HttpError(400, 'Optional message.'));

app.use(HttpError.errorHandler);

// JSON response.
{
  "code": 400,
  "status": "Bad Request",
  "message": "Optional message."
}
```
