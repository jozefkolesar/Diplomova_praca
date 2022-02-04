const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  //mal by byť stále na vrchu, niektorí píšu žeby sa nemali používať, ale malo by sa chytať cez catch tam kde problém nastane/môže nastať, je to len safety net
  console.log(err.name, err.message);
  console.log('Uncaught exception!');
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB pripojená na aplikáciu'));

//console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server funguje na porte: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection! Vypínam aplikáciu ...');
  server.close(() => {
    process.exit(1); //ukončím aplikáciu 0- všetko v poriadku, 1 - problém -- táto metoda príliš agresívna, preto musí byť v callback funkcii ukončenia serveru
  });
});
