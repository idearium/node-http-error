// http://www.ietf.org/assignments/http-status-codes/http-status-codes.xml
const statusCodes = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Unassigned',
  426: 'Upgrade Required',
  427: 'Unassigned',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  430: 'Unassigned',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  509: 'Unassigned',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};

/**
 * Validates and filters an error object.
 * @param  {Object} [error={}] The error object to filter.
 * @return {Object}            Filtered error object.
 */
const validateError = (error) => {

  if (!error) {
    return {};
  }

  const validProperties = ['code', 'message', 'target', 'details', 'innererror'];
  const keys = Object.keys(error);
  const properties = keys.filter(property => validProperties.includes(property));
  const validError = {};
  const has = Object.prototype.hasOwnProperty;

  for (const property of properties) {

    if (has.call(error, property)) {
      validError[property] = error[property];
    }

  }

  return validError;

};

/**
 * Validates a HTTP status code.
 * @param  {Number} code HTTP status code.
 * @return {Number}      The HTTP status code.
 */
const validateStatusCode = (code) => {

  if (!code) {
    return false;
  }

  const keys = Object.keys(statusCodes);

  return keys.includes(code.toString());

};

class HttpError extends Error {

  /**
   * Create a HttpError.
   * @param  {Number} code    The HTTP status code.
   * @param  {Object} options HttpError options.
   */
  constructor(code, options) {

    const defaultCode = 400;
    const filteredOptions = validateError(options);
    const statusCode = validateStatusCode(code) ? code : defaultCode;
    const status = statusCodes[statusCode];
    const errorMessage = `${statusCode} ${statusCodes[statusCode]}`;

    super(errorMessage);

    const defaults = {
      code: status,
      message: status,
    };

    this.statusCode = statusCode;
    this.error = Object.assign(defaults, filteredOptions);

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }

    this.stack = (new Error(errorMessage)).stack;

  }

  static errorHandler(err, req, res, next) {

    if (err instanceof HttpError) {

      const { error } = err;

      return res.status(err.statusCode)
        .json({ error });

    }

    return next(err);

  }

}

module.exports = HttpError;
