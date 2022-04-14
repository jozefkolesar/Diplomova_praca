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
  const errors = Object.values(err.errors).map((el) => el.message); //Object values sú celé objekty - Postman
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

  res.status(err.statusCode).render('error', {
    title: 'Niečo sa pokazilo!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    //Error na operačnej úrovni, posielam užívateľovi chybu
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programovacia chyba, nedávam vedieť používateľovi
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Niečo sa veľmi veľmi pokazilo!',
    });
  }

  //Error na operačnej úrovni, posielam užívateľovi chybu
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Niečo sa pokazilo!',
      msg: err.message,
    });
  }
  //Programovacia chyba, nevypisujem používateľovi detaily
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Niečo sa pokazilo!',
    msg: 'Prosím, skúste zopakovať akciu neskôr.',
  });
};

module.exports = (err, req, res, next) => {
  //error handling middleware
  err.statusCode = err.statusCode || 500; //500 = internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleExpiredToken();
    sendErrorProd(error, res);
  }
};
