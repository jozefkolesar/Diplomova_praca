class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //volám parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); //stack trace
  }
}
//výpisy errorov vzhľadom na kód, ktorý je errorom vytvorený
module.exports = AppError;
