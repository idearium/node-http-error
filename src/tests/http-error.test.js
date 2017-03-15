/* eslint-env mocha */
/* eslint-disable func-names, no-magic-numbers, prefer-arrow-callback */

const express = require('express');
const HttpError = require('../http-error');
const request = require('supertest');

/**
 * Example error route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function errorRoute(req, res, next) {
  return next(new HttpError(400, 'Something went wrong.'));
}

/**
 * Example missing statusCode route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function missingStatusCodeRoute(req, res, next) {
  return next(new HttpError(-1));
}

/**
 * Example null statusCode route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function nullStatusCodeRoute(req, res, next) {
  return next(new HttpError(null));
}

/**
 * Example text statusCode route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function textStatusCodeRoute(req, res, next) {
  return next(new HttpError('Oops'));
}

/**
 * Example undefined statusCode route.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function undefinedStatusCodeRoute(req, res, next) {
  return next(new HttpError());
}

describe('HttpError', function () {

  const app = express();

  before(function () {

    app.get('/error-route', errorRoute);
    app.get('/missing-status-code-route', missingStatusCodeRoute);
    app.get('/null-status-code-route', nullStatusCodeRoute);
    app.get('/text-status-code-route', textStatusCodeRoute);
    app.get('/undefined-status-code-route', undefinedStatusCodeRoute);

    app.use(HttpError.errorHandler);

  });

  it('should return a code, status, and message', function (done) {

    request(app)
      .get('/error-route')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: 'Something went wrong.',
        status: 'Bad Request',
      }, done);

  });

  it('should return default to 400 Bad Request for missing status codes', function (done) {

    request(app)
      .get('/missing-status-code-route')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: '',
        status: 'Bad Request',
      }, done);

  });

  it('should return default to 400 Bad Request for null status codes', function (done) {

    request(app)
      .get('/null-status-code-route')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: '',
        status: 'Bad Request',
      }, done);

  });

  it('should return default to 400 Bad Request for text status codes', function (done) {

    request(app)
      .get('/text-status-code-route')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: '',
        status: 'Bad Request',
      }, done);

  });

  it('should return default to 400 Bad Request for undefined status codes', function (done) {

    request(app)
      .get('/undefined-status-code-route')
      .expect('Content-Type', /json/)
      .expect(400, {
        code: 400,
        message: '',
        status: 'Bad Request',
      }, done);

  });

});
