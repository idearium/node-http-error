const express = require('express');
const HttpError = require('../lib/index');
const request = require('supertest');

/**
 * Error statusCode.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const errorStatusCode = (req, res, next) => next(new HttpError(401));

/**
 * Undefined statusCode.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const undefinedStatusCode = (req, res, next) => next(new HttpError());

/**
 * Example null statusCode route.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const nullStatusCode = (req, res, next) => next(new HttpError(null));

/**
 * Text statusCode.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const textStatusCode = (req, res, next) => next(new HttpError('Oops'));

/**
 * Array statusCode.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const arrayStatusCode = (req, res, next) => next(new HttpError(['error']));

/**
 * Object statusCode.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const objectStatusCode = (req, res, next) => next(new HttpError({ error: 'error' }));

describe('HttpError status codes', () => {

  const app = express();

  beforeAll(() => {

    app.get('/error-status-code', errorStatusCode);
    app.get('/undefined-status-code', undefinedStatusCode);
    app.get('/null-status-code', nullStatusCode);
    app.get('/text-status-code', textStatusCode);
    app.get('/array-status-code', arrayStatusCode);
    app.get('/object-status-code', objectStatusCode);

    app.use(HttpError.errorHandler);

  });

  it('should return an error object', () => {

    return request(app)
      .get('/error-status-code')
      .expect('Content-Type', /json/)
      .expect(401, {
        error: {
          code: 'Unauthorized',
          message: 'Unauthorized',
        },
      });

  });

  it('should default to 400 Bad Request for undefined status codes', () => {

    return request(app)
      .get('/undefined-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

  it('should default to 400 Bad Request for null status codes', () => {

    return request(app)
      .get('/null-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

  it('should default to 400 Bad Request for text status codes', () => {

    return request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

  it('should default to 400 Bad Request for array status codes', () => {

    return request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

  it('should default to 400 Bad Request for object status codes', () => {

    return request(app)
      .get('/text-status-code')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

});
