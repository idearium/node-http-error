const express = require('express');
const httpError = require('../lib/index');
const request = require('supertest');

const app = express();

beforeAll(() => {

  app.use(httpError());

  app.get('/teststring', (req, res) => res.error('test'));
  app.get('/testerrorobj', (req, res) => res.error(new Error('test')));
  app.get('/testcustom', (req, res) => res.error({
    code: 'ERRBADREQUEST',
    message: 'test',
    statusCode: 401,
  }));

});

test('accepts a string', () => request(app)
  .get('/teststring')
  .expect('Content-Type', /json/)
  .expect(400, {
    error: {
      code: '',
      message: 'test',
    },
  }));

test('accepts an Error object', () => request(app)
  .get('/testerrorobj')
  .expect('Content-Type', /json/)
  .expect(400, {
    error: {
      code: '',
      message: 'test',
    },
  }));

test('accepts a custom object', () => request(app)
  .get('/testcustom')
  .expect('Content-Type', /json/)
  .expect(401, {
    error: {
      code: 'ERRBADREQUEST',
      message: 'test',
    },
  }));
