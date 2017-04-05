const express = require('express');
const HttpError = require('../src/index');
const request = require('supertest');

/**
 * Target property.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function targetProperty(req, res, next) {
  return next(new HttpError(400, { target: 'Target' }));
}

/**
 * Details property.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function detailsProperty(req, res, next) {

  return next(new HttpError(400, {
    details: [
      {
        code: 'NullValue',
        message: 'Phone number must not be null',
        target: 'PhoneNumber',
      },
    ],
  }));

}

/**
 * Innererror property.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function innererrorProperty(req, res, next) {

  return next(new HttpError(400, {
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

}

/**
 * Incorrect property.
 * @param  {Object}   req  Express request object.
 * @param  {Object}   res  Express response object.
 * @param  {Function} next Express next function.
 * @return {HttpError}     HttpError object.
 */
function incorrectProperty(req, res, next) {
  return next(new HttpError(400, { someproperty: 'This should not show up!' }));
}

describe('HttpError error object', function () {

  const app = express();

  before(function () {

    app.get('/target-property', targetProperty);
    app.get('/details-property', detailsProperty);
    app.get('/innererror-property', innererrorProperty);
    app.get('/incorrect-property', incorrectProperty);

    app.use(HttpError.errorHandler);

  });

  it('should return a target property if provided', function (done) {

    request(app)
      .get('/target-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
          target: 'Target',
        },
      }, done);

  });

  it('should return a details property if provided', function (done) {

    request(app)
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
      }, done);

  });

  it('should return an innererror property if provided', function (done) {

    request(app)
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
      }, done);

  });

  it('should exclude invalid property names', function (done) {

    request(app)
      .get('/incorrect-property')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: {
          code: 'Bad Request',
          message: 'Bad Request',
        },
      }, done);

  });

});
