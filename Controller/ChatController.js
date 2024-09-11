const ChatModel = require('./../Model/ChatModel');
const ErrorClass = require('./../Utils/ErrorClass');
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
module.exports = { saveMessage, getMessages };
