const AppError = require('../utilities/appError');

const handleCastErrorDB = (err) => {
  const message = `Nesprávne ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Tento názov ${value} už bol zadaný, zadaj prosím iný názov`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); //object values sú celé tie objekty - Postman
  const message = `Nesprávne vstupné dáta. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Nefunkčný token. Prosím prihláste sa znovu!', 401);

const handleExpiredToken = () =>
  new AppError('Platnosť tokenu vypršala, prihláste sa znovu!', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  //RENDERED WEBSITE
  res.status(err.statusCode).render('error', {
    //renderujem page -> error (template)
    title: 'Niečo sa pokazilo!',
    msg: err.message, //posielam msg do šablony
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Niečo sa veľmi veľmi pokazilo!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Niečo sa pokazilo!',
      msg: err.message,
    });
  }
  // B) Programovacia chyba, nevypisujem používateľovi detaily
  // 1) Console log výpis
  console.error('ERROR 💥', err);
  // 2) MESSAGE
  return res.status(err.statusCode).render('error', {
    title: 'Niečo sa pokazilo!',
    msg: 'Prosím, skúste zopakovať akciu neskôr.',
  });
};

module.exports = (err, req, res, next) => {
  //error handling middleware
  err.statusCode = err.statusCode || 500; //500 = internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleExpiredToken();
    sendErrorProd(error, res);
  }
};
