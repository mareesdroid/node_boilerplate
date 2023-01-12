const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const chalk = require('chalk');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  console.info('err mesaage')

  console.info(message)

  if (config.env === 'prod' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    error: err.error,
    message: message.replace(/['"]+/g, ''),
    ...(config.env === 'development' && { stack: err.stack }),
  };

  console.info(err)
  console.info(err.stack)
  // remove in production
  console.log(chalk.red(err));
  console.log(chalk.red(err.stack));

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
