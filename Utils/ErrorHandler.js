const development = (err, res) => {
  const response = {
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  };
  res.status(err.statusCode).json(response);
};
const production = (err, res) => {
  if (err.isOperational) {
    const response = {
      status: err.status,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
  } else {
    const response = {
      status: 500,
      message: 'Something went wrong please try again later',
    };
    res.status(err.statusCode).json(response);
  }
};

const ErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.TYPE === 'Development') {
    development(err, res);
  } else {
    production(err, res);
  }
};

module.exports = ErrorHandler;
