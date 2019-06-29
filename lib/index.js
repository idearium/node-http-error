const log = require('pino')();

module.exports = () => (req, res, next) => {

  res.error = (err = '') => {

    let code = '';
    let message = '';
    let statusCode = 400;

    if (typeof err === 'string') {

      message = err;

    }

    if (err.code) {

      code = err.code;

    }

    if (err.message) {

      message = err.message;

    }

    if (err.statusCode) {

      statusCode = err.statusCode;

    }

    if (err instanceof Error) {

      log.warn({ err }, message);

    }

    return res.status(statusCode).json({
      error: { code, message },
    });

  };

  return next();

};
