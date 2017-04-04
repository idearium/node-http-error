/* eslint-env mocha */
/* eslint-disable func-names, no-magic-numbers, prefer-arrow-callback */

const express = require('express');
const HttpError = require('../src/http-error');
const request = require('supertest');

/**
 * Error statusCode.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function errorStatusCode(req, res, next) {
  return next(new HttpError(401));
}

/**
 * Undefined statusCode.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function undefinedStatusCode(req, res, next) {
  return next(new HttpError());
}

/**
 * Example null statusCode route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function nullStatusCode(req, res, next) {
  return next(new HttpError(null));
}

/**
 * Text statusCode.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function textStatusCode(req, res, next) {
  return next(new HttpError('Oops'));
}

/**
 * Array statusCode.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function arrayStatusCode(req, res, next) {
  return next(new HttpError(['error']));
}

/**
 * Object statusCode.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function objectStatusCode(req, res, next) {
  return next(new HttpError({ error: 'error' }));
}

describe('HttpError status codes', function () {

  const app = express();

  before(function () {

    app.get('/error-status-code', errorStatusCode);
    app.get('/undefined-status-code', undefinedStatusCode);
    app.get('/null-status-code', nullStatusCode);
    app.get('/text-status-code', textStatusCode);
    app.get('/array-status-code', arrayStatusCode);
    app.get('/object-status-code', objectStatusCode);

    app.use(HttpError.errorHandler);

  });

  it('should return an error object', function (done) {

    request(app)
      .get('/error-status-code')
      .expect('Content-Type', /json/)
      .expect(401, {
        error: {
          code: 'Unauthorized',
          message: 'Unauthorized',
        },
      }, done);

  });

  it('should default to 400 Bad Request for undefined status codes', function (done) {

    request(app)
      .get('/undefined-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

  it('should default to 400 Bad Request for null status codes', function (done) {

    request(app)
      .get('/null-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

  it('should default to 400 Bad Request for text status codes', function (done) {

    request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

  it('should default to 400 Bad Request for array status codes', function (done) {

    request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

  it('should default to 400 Bad Request for object status codes', function (done) {

    request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

});
