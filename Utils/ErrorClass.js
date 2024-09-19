// this class helps us to define err message and status Code
class ErrorClass extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

module.exports = ErrorClass;
