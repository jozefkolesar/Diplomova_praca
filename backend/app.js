const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const reportRouter = require('./routes/reportRoutes');
const userRouter = require('./routes/userRoutes');
const timetableRouter = require('./routes/timetableRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(cors());

app.options('*', cors());
//HTTP Headers - ochrana
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:', 'https://*.mapbox.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);

//Development - morgan middleware - requested data
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('dev'));
}

//body parser, čítanie dát z req.body
app.use(express.json({ limit: '10kb' })); //limitácia json na 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitizácia - očisťovanie dát proti NOSQL injection cez meno {"$gt": ""} a heslo, ktoré je známe... odstráni $ a podobne
app.use(mongoSanitize());

// Data sanitizácia - očisťovanie dát proti XSS útoku, odstráni neznámy HTML kód
app.use(xss());

//parameter pollution
app.use(
  hpp({
    whitelist: [], //whitelist, ktoré výskyty povolím viac ako raz
  })
);

//express.static - statické fily - obrazky, tabuľky, dokumenty
app.use(express.static(path.join(__dirname, 'public')));

//middleware  - dlžka odozvy servera a vykonania akcie + cookies

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//limiter proti brute force
// const limiter = rateLimit({
//   //max 100 requestov z rovnakej IP za hodinu //proti brute force
//   max: 150,
//   windowMs: 60 * 60 * 1000,
//   message: 'Príliš veľa requestov z tejto IP adresy!',
// });

//app.use('/', limiter); //,limiter

// 3 ROUTES - mountovanie routerov
//ked dam ku :id  otaznik ? tak tym padom ho urobim ze je optional

app.use('/api/reports', reportRouter);
app.use('/api/users', userRouter);
app.use('/api/timetables', timetableRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} sa nenachádza na serveri!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
