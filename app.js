// configure files
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// error handling
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// importing modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const mongoose = require('mongoose');

// importing in app modules
const ErrorHandler = require('./Utils/ErrorHandler');
const ErrorClass = require('./Utils/ErrorClass');
const AuthRouter = require('./Router/AuthRouter');
const UserRouter = require('./Router/UserRouter');
const JobRouter = require('./Router/JobRouter');
const ChatRouter = require('./Router/ChatRouter');
const QuestionsRouter = require('./Router/QuestionRouter');
const ChatController = require('./Controller/ChatController');

const app = express();

// creating servers
const server = http.createServer(app);
const io = new Server(server);

// middleware
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from the 'public' directory
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// getting db url
const DB_URL = process.env.MONGO_DB_URL.replace('<password>', 'kansalrijul123');

// trying to connect to db
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

// routers
app.use('/v1/authentication', AuthRouter);
app.use('/v1/user', UserRouter);
app.use('/v1/jobs', JobRouter);
app.use('/v1/chats', ChatRouter);
app.use('/v1/questions', QuestionsRouter);

// if no router matches then return error
app.all('*', (req, res, next) => {
  return next(
    new ErrorClass(
      'This route is not defined please check the end url once',
      404
    )
  );
});
const users = new Map();

// web socket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  const { userId } = socket.handshake.query;
  // storing socket id to array

  users.set(userId, socket.id);
  ChatController.sendAndReceiveMessage(io, socket, users);
  ChatController.disconnectAlert(socket, users);
});

// listening to server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:3000');
});

// middle ware
app.use(ErrorHandler);

// error message
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
