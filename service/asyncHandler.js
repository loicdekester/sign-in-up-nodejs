const { pgp } = require('../repository/index');
const QueryResultError = pgp.errors.QueryResultError;

/**
 * function to handle errors in async http protocol
 * @param { function } func - callback function
 */
const asyncHandler = func => (req, res, next) => {
  func(req, res, next).catch((error) => {
    if (error instanceof QueryResultError) {
      console.log(error);
      error.status = 500;
    }
    next(error);
  });
}

module.exports = asyncHandler
