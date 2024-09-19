const ChatModel = require('./../Model/ChatModel');
const ErrorClass = require('./../Utils/ErrorClass');
const UserModel = require('./../Model/UserModel');

// integrating firebase
var admin = require('firebase-admin');
const cred = require('./../Utils/keys').keys;
admin.initializeApp({
  credential: admin.credential.cert(cred),
});

// save message to DB
const saveMessage = async (
  userId1,
  userId2,
  message,
  timeStamp,
  messageSeen
) => {
  // saving data
  try {
    await ChatModel.create({
      userId1,
      userId2,
      message,
      timeStamp,
      messageSeen,
    });
    return 'successfully saved';
  } catch (err) {
    throw err;
  }
};

// get recent message
const getMessages = async (req, res, next) => {
  try {
    // getting required params
    const userId1 = req.user.id;
    const userId2 = req.params.id;
    // if no user then return error
    if (!userId2) {
      return next(new ErrorClass('please pass user id in params', 400));
    }

    // getting query params
    const query = req.query;
    const limit = query.limit * 1 || 30;
    const skip = query.skip * 1 || 0;
    // validating query params
    if (limit < 0 || skip < 0) {
      return next(new ErrorClass('Please enter valid query', 400));
    }

    // getting data
    const data = await ChatModel.find({
      $or: [
        {
          userId1: userId1,
          userId2: userId2,
        },
        {
          userId1: userId2,
          userId2: userId1,
        },
      ],
    })
      .limit(limit)
      .skip(skip * limit)
      .sort('-timeStamp');

    const response = {
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// this fn will help us to connect to web sockets
const sendAndReceiveMessage = async (io, socket, users) => {
  // userId1 -- sender
  // userId1 -- receiver
  try {
    socket.on('chat message', async (userId1, userId2, message, timeStamp) => {
      // if all params send by user
      if (userId1 && userId2 && message && timeStamp) {
        // checking if 2nd user is connected or not
        if (users.has(userId2)) {
          // saving message to DB
          await saveMessage(userId1, userId2, message, timeStamp, true);
          // send message
          io.to(users.get(userId2)).emit('chat message', {
            message,
            userId1,
            timeStamp,
          });
        } else {
          // if user is not online
          // save in DB
          await saveMessage(userId1, userId2, message, timeStamp, false);

          // sending push notification that you received new message
          let userDetails2;
          try {
            userDetails2 = await UserModel.findOne({ _id: userId2 });
          } catch (err) {
            // console.error('Error fetching user details:', err.message);
            // Notify the sender about the issue
            io.to(users.get(userId1)).emit('error', {
              error: 'Error fetching recipient details. Please try again.',
            });
            return;
          }
          const registrationToken = userDetails2.fcmToken;
          if (registrationToken) {
            const messages = {
              data: {
                title: 'New Message',
                body: 'Received a message from recruiter',
              },
              token: registrationToken,
            };
            admin
              .messaging()
              .send(messages)
              .then((response) => {
                console.log('Notification sent:', response);
              })
              .catch((error) => {
                console.error('Error sending notification:', error);
              });
          }
        }
      } else {
        io.to(users.get(userId1)).emit('error', {
          error: 'Please pass all the params',
        });
      }
    });
  } catch (err) {
    io.to(users.get(userId2)).emit('error', {
      errorMessage: err.message,
    });
    io.to(users.get(userId1)).emit('error', {
      errorMessage: err.message,
    });
  }
};

// this fn will return key corresponding to socket id
function keyValue(map, searchKey) {
  for (const [key, value] of map.entries()) {
    if (value === searchKey) return key;
  }
  return undefined;
}

// when user disconnect
const disconnectAlert = (socket, user) => {
  // delete socket id
  socket.on('disconnect', () => {
    user.delete(keyValue(user, socket.id));
    console.log('user disconnected');
  });
};
module.exports = {
  saveMessage,
  getMessages,
  sendAndReceiveMessage,
  disconnectAlert,
};
