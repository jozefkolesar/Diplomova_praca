class AppError extends Error {
  constructor(message, statusCode) {
    //constructor je volaný vždy keď vytvoríme nový objekt tejto classy
    super(message); //volám parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //ak začína status code 4rkou teda 404 tak vypíše fail
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); //stack trace
  }
}

module.exports = AppError;
