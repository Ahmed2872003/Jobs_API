const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;

    const keys = Object.keys(err.errors);

    customError.message = `Must provide ${keys} field${
      keys.length == 1 ? "" : "s"
    }`;
  }

  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `No item found with id: ${err.value}`;
  }

  if (err.code === 11000) {
    customError.statusCode = StatusCodes.CONFLICT;

    const keys = Object.keys(err.keyValue);

    customError.message = `Duplicate value entered for ${keys} field${
      keys.length == 1 ? "" : "s"
    }, please choose another value`;
  }

  res.status(customError.statusCode).json({ msg: customError.message });
  // res.status(customError.statusCode).json({ err });
};
module.exports = errorHandlerMiddleware;
