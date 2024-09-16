const QuestionsModel = require('./../Model/QuestionModel');
const ErrorClass = require('./../Utils/ErrorClass');
// add in user db about score
const displayQuestions = async (req, res, next) => {
  try {
    const type = req.params.type;
    if (!type) {
      return next('Type should be there', 400);
    }
    for (ele of req.user.certificateEarned) {
      if (ele.type === type) {
        const tDate = Date.now();
        if (6 * 30 * 24 * 60 * 60 * 1000 > tDate - ele.date) {
          return next(
            new ErrorClass(
              `You have already gave ${type} test. Please try after 6 month from given date`,
              400
            )
          );
        } else {
          break;
        }
      }
    }

    const data = await QuestionsModel.find({ type });

    const len = data.length;
    const sets = new Set();
    let finalData = [];
    let i = 0;
    while (i < 10) {
      const ele = Math.floor(Math.random() * len);
      if (!sets.has(ele)) {
        finalData.push(data[ele]);
        i++;
        sets.add(ele);
      }
    }
    const response = {
      status: 'success',
      data: {
        data: finalData,
      },
    };
    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const showTypesOfQuestions = async (req, res, next) => {
  try {
    const types = await QuestionsModel.distinct('type');
    const availableTypes = new Set(types);
    const currentDate = Date.now();
    const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
    req.user.certificateEarned.forEach((cert) => {
      if (currentDate - cert.date < sixMonthsInMs) {
        availableTypes.delete(cert.type);
      }
    });
    const finalData = Array.from(availableTypes);
    res.status(200).json({
      status: 'success',
      data: {
        data: finalData,
      },
    });
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const addDataToUserDb = async (req, res, next) => {
  try {
    const { type, score } = req.body;
    if (!type || !score) {
      return next(new ErrorClass('Please enter type or score', 400));
    }
    const certificate = req.user.certificateEarned;
    let flag = 0;
    for (ele of certificate) {
      if (ele.type === type) {
        console.log(ele.type);
        flag = 1;
        if (ele.score < score) {
          ele.score = score;
        }
        ele.date = Date.now();
      }
    }
    if (flag === 0) {
      certificate.push({ type, score });
    }
    req.user.certificateEarned = certificate;
    await req.user.save();

    const response = {
      status: 'success',
      message: 'successfully added',
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
module.exports = {
  displayQuestions,
  showTypesOfQuestions,
  addDataToUserDb,
};
