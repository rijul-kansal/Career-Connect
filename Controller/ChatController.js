const ChatModel = require('./../Model/ChatModel');

const saveMessage = async (userId1, userId2, message, timeStamp) => {
  try {
    // console.log('Rk', userId1, userId2, message, timeStamp);
    const ts = Date.now();
    await ChatModel.create({
      userId1,
      userId2,
      message,
      timeStamp: ts,
    });
    // console.log(data);
    return 'successfully saved';
  } catch (err) {
    // console.log(err);
    return err.message;
  }
};
module.exports = { saveMessage };
