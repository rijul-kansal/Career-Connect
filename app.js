const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const ErrorHandler = require('./Utils/ErrorHandler');
const ErrorClass = require('./Utils/ErrorClass');
const AuthRouter = require('./Router/AuthRouter');
const UserRouter = require('./Router/UserRouter');
const JobRouter = require('./Router/JobRouter');
const app = express();
// middleware
app.use(morgan('dev'));
app.use(express.json());

const DB_URL = process.env.MONGO_DB_URL.replace('<password>', 'kansalrijul123');
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('successfully connected to mongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/v1/authentication', AuthRouter);
app.use('/v1/user', UserRouter);
app.use('/v1/jobs', JobRouter);
app.all('*', (req, res, next) => {
  return next(
    new ErrorClass(
      'This route is not defined please check the end url once',
      404
    )
  );
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening of port ${PORT}`);
});

app.use(ErrorHandler);

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
