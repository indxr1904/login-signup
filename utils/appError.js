class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = true;
    this.errMessage = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
