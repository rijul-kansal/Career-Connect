const ChatModel = require('./../Model/ChatModel');
const ErrorClass = require('./../Utils/ErrorClass');
const UserModel = require('./../Model/UserModel');
var admin = require('firebase-admin');
const cred = require('./../Utils/keys').firebase_keys;
admin.initializeApp({
  credential: admin.credential.cert(cred),
});
const saveMessage = async (
  userId1,
  userId2,
  message,
  timeStamp,
  messageSeen
) => {
  try {
    const time = Date.now();
    await ChatModel.create({
      userId1,
      userId2,
      message,
      timeStamp: time,
      messageSeen,
    });
    return 'successfully saved';
  } catch (err) {
    return err.message;
  }
};
const getMessages = async (req, res, next) => {
  try {
    const userId1 = req.user.id;
    const userId2 = req.params.id;
    const query = req.query;
    const limit = query.limit * 1 || 30;
    const skip = query.skip * 1 || 0;
    if (limit < 0 || skip < 0) {
      return next(new ErrorClass('Please enter valid query', 400));
    }
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
      data: {
        data,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

const sendAndReceiveMessage = async (io, socket, users) => {
  // userId1 -- sender
  // userId1 -- receiver

  socket.on('chat message', async (userId1, userId2, message, timeStamp) => {
    if (userId1 && userId2 && message && timeStamp) {
      users.set(userId1, socket.id);
      if (users.has(userId2)) {
        saveMessage(userId1, userId2, message, timeStamp, true);
        io.to(users.get(userId2)).emit('chat message', {
          message,
          userId1,
          timeStamp,
        });
      } else {
        saveMessage(userId1, userId2, message, timeStamp, false);
        const userDetails2 = await UserModel.findOne({ _id: userId2 });
        const registrationToken = userDetails2.fcmToken;
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
  });
};
function keyValue(map, searchKey) {
  for (const [key, value] of map.entries()) {
    if (value === searchKey) return key;
  }
  return undefined;
}
const disconnectAlert = (socket, user) => {
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
