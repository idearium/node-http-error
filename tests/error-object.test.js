const express = require('express');
const HttpError = require('../lib/index');
const request = require('supertest');

/**
 * Target property.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const targetProperty = (req, res, next) => next(new HttpError(400, { target: 'Target' }));

/**
 * Details property.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const detailsProperty = (req, res, next) => next(new HttpError(400, {
  details: [
    {
      code: 'NullValue',
      message: 'Phone number must not be null',
      target: 'PhoneNumber',
    },
  ],
}));

/**
 * Innererror property.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const innererrorProperty = (req, res, next) => next(new HttpError(400, {
  innererror: {
    innererror: {
      characterTypes: ['lowerCase', 'upperCase', 'number', 'symbol'],
      code: 'PasswordDoesNotMeetPolicy',
      innererror: { code: 'PasswordReuseNotAllowed' },
      maxLength: 64,
      minDistinctCharacterTypes: 2,
      minLength: 6,
    },
  },
}));

/**
 * Incorrect property.
 * @param {Object} req HTTP request object.
 * @param {Object} res HTTP response object.
 * @param {Function} next Call the next middleware.
 * @return {HttpError} HttpError object.
 */
const incorrectProperty = (req, res, next) => next(new HttpError(400, { someproperty: 'This should not show up!' }));

describe('HttpError error object', () => {

  const app = express();

  beforeAll(() => {

    app.get('/target-property', targetProperty);
    app.get('/details-property', detailsProperty);
    app.get('/innererror-property', innererrorProperty);
    app.get('/incorrect-property', incorrectProperty);

    app.use(HttpError.errorHandler);

  });

  it('should return a target property if provided', () => {

    return request(app)
      .get('/target-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
          target: 'Target',
        },
      });

  });

  it('should return a details property if provided', () => {

    return request(app)
      .get('/details-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          details: [
            {
              code: 'NullValue',
              message: 'Phone number must not be null',
              target: 'PhoneNumber',
            },
          ],
          message: 'Bad Request',
        },
      });

  });

  it('should return an innererror property if provided', () => {

    return request(app)
      .get('/innererror-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          innererror: {
            innererror: {
              characterTypes: ['lowerCase', 'upperCase', 'number', 'symbol'],
              code: 'PasswordDoesNotMeetPolicy',
              innererror: { code: 'PasswordReuseNotAllowed' },
              maxLength: 64,
              minDistinctCharacterTypes: 2,
              minLength: 6,
            },
          },
          message: 'Bad Request',
        },
      });

  });

  it('should exclude invalid property names', () => {

    return request(app)
      .get('/incorrect-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      });

  });

});
