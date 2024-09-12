const ChatModel = require('./../Model/ChatModel');
const ErrorClass = require('./../Utils/ErrorClass');
const UserModel = require('./../Model/UserModel');
var admin = require('firebase-admin');
const cred = {
  type: 'service_account',
  project_id: 'all-backend-fd5c7',
  private_key_id: 'ae77fc9fb7b21287de5c7020e1db96833fca3c77',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDYojfe71e6b8c2\n+Fw8Io3DNM+e8LhkywW/1DMvY0CC1zVa44kBDcf5+Tha+vvaBr2iPdbwHzdaFbT0\nkXSh6Z1XuKJ5kkv2Pul03mGTz4DyHw81s0Hlmvs0Q0BWnIgSn9r6XFfn+eZNB+xR\nN+shdqJwhapd57KJGE1Shldzbj8A2Dy+51m+LNuLCBEAGMJDwe5zf2XNd9ni+LBw\nWDK/UNj0AJy5ZuP5hzMwY8GLWHz9RNZCaRLytQKsWNvCeggJKmHBKizwbJWbU0Wr\n2WCtPyNXtAn+mAtzMIRJPqiSIvvc2/IGCuXwJKa9zF8jsg+MDCdNg7Tk0LWeXeYl\nhfdNWASbAgMBAAECggEAEQbBUZr9I0P/lwq/iq7Q9ouf8w2Km8o39vZEjNAGG3wZ\nQorJbO6tp30Wsh8YDInk497S/GEJUC7Bkxe1k4SeRboKWkTAOXS2k5iaeB9If38n\nPZPyG3I2/GOtJ45UKyaRc7j7So1VGpVpvCgJdnVYQHP4/aClL+pCW+vMIGBRwMAy\np7WzALrHFiUF58Z9uwA8FOZKeWhFqUgxvJy5SEzNRIJo2t9Cm87xn6gHkdbaXSPn\nhNI5MRy5CCkEET211lMJwGjw6NKijqgg9BM/n49//yu5CRnbpcF1rKyjUkv99F0u\n8J3JBS4pnjXF7BoKJ4zO8mbspxUaWltM/fQKdc+awQKBgQDzxxX3e7FzIWGbK3bQ\nZtbdiQWYz+TNcEmRFx9jlgvKTDrj19MO23v8NDgihghARdpS/W+PEHcglPHHVQtC\nws9NMAEiTSwNAE9VCqfAlNWlyRIhhPn1VOLLSmQyhlXAY/KqJMPeC22cqAhbpKGA\nhTGBXIqOdG68DIVg4W1G1pudWwKBgQDjfrxmW8fFbNxCErK89m5VsGwqEudDD4jg\nmM9kBYlEZ8jf/G9DnzyKXeckpVdsdCYMSoyFtgDDy4xNw3rBHkEIovpoMylOB4qG\n9lHrqKuX+WRk34SSrQv5EnWcJ4TMAdkRhKFeabkfNXrPEGT9x2TZa4uBD82E4Yb3\nIEp33OGZwQKBgCjiF5YEwZLMY2ExneB/jsNiinTBUN7/WOcjWJlL/bg0pp+1f2j7\neESowU1Q6ytUS7QlWsNEgKYPNKk4YwYUQ83vIhGNnbikd6mMeuu6SkZefVLvyTfS\nv6JWXI14qAL3ACh2t/6SLhTavWQZLRivvcizK22Oq0+QTgIcbEY4EasHAoGAdlMJ\n3Ndp7Za0bS1aiAxI0QrlB3Ezld6zm9X/MI/smIa+pTmgCXT+QR2cRqQ093TmAUiZ\nFEbY2P266Qt+gomg28QhKCdMGYi0lYPykfb14SLXA9x6EOwuqQrf3yty18UySPlK\nEVg98CyZxq9JR/H401krgyJcC/xdfZXvBa7+LEECgYB5v5vJHv4INpUEzA2F7qE8\nqzy9taDjzzxGqljCWvsdy91UbNCTVg6hX88yVjW6SF+LgEEuEoFjryWgtqAe24oB\nNOjHCpZqikjh7GrsIRrqRcoQ6Z016XT4zmyQ+HMb2MHU65BCRB3j+xhv2qdQQtEU\nbVemg3/BNxIsIw4hFqqmSg==\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-n3v9l@all-backend-fd5c7.iam.gserviceaccount.com',
  client_id: '107054637939565406677',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n3v9l%40all-backend-fd5c7.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
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
