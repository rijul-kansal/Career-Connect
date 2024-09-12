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
const ChatController = require('./Controller/ChatController');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

// middleware
app.use(morgan('dev'));
app.use(express.json());
// Serve static files from the 'public' directory
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
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
app.use('/v1/chats', ChatRouter);
app.all('*', (req, res, next) => {
  return next(
    new ErrorClass(
      'This route is not defined please check the end url once',
      404
    )
  );
});
const users = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');
  ChatController.sendAndReceiveMessage(io, socket, users);
  ChatController.disconnectAlert(socket, users);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:3000');
});

app.use(ErrorHandler);

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
