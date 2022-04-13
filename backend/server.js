const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception! Vypínam server');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./config.env` });
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

process.on('SIGTERM', () => {
  console.log('Prijatý SIGTERM, vypínam server');
  server.close(() => {
    console.log('Proces vypnutý');
  });
});
