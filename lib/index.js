const log = require('pino')();

module.exports = (req, res, next) => {
  res.error = (err = '') => {
    let code = 400;
    let message = '';
    let stack;

    if (typeof err === 'string') {
      message = err;
    }

    if (err instanceof Error) {
      code = err.code;
      message = err.message;
      stack = err.stack;
      log.trace({ err }, message);
    }

    return res.status(err.code).json({
      error: { code: err.code, message: err.message, stack: err.stack },
    });
  };

  return next();
};
