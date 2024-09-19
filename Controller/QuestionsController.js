const QuestionsModel = require('./../Model/QuestionModel');
const ErrorClass = require('./../Utils/ErrorClass');

// this fn will display random 10 question
const displayQuestions = async (req, res, next) => {
  try {
    // getting params
    const type = req.params.type;
    // if no params then error
    if (!type) {
      return next('Type should be there', 400);
    }
    // checking if user not given this test in last 6 month or not
    // if not then this will display questions
    // else error message
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

    // getting data
    const data = await QuestionsModel.find({ type });
    // get any 10 random question
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

// this fn will show all types of quiz available that particular user can give
const showTypesOfQuestions = async (req, res, next) => {
  try {
    // get all distinct types of quiz available
    const types = await QuestionsModel.distinct('type');

    // converting into set
    const availableTypes = new Set(types);

    // getting current date as well as 6 month ago dated
    const currentDate = Date.now();
    const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
    // if user gave this test in last 6 month then we will not show
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

// this will add score in Db
const addDataToUserDb = async (req, res, next) => {
  try {
    const { type, score } = req.body;
    if (!type || !score) {
      return next(new ErrorClass('Please enter type or score', 400));
    }

    // getting user certificate
    const certificate = req.user.certificateEarned;
    let flag = 0;
    for (ele of certificate) {
      // if certificate type matches

      if (ele.type === type) {
        flag = 1;
        // if score greater then previous score then update score
        if (ele.score < score) {
          ele.score = score;
        }
        // update time
        ele.date = Date.now();
      }
    }
    // if type not found then add new certificate
    if (flag === 0) {
      certificate.push({ type, score });
    }

    // saving in DB
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
