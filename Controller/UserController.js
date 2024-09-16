const UserModel = require('./../Model/UserModel');
const ErrorClass = require('./../Utils/ErrorClass');

const updateMe = async (req, res, next) => {
  try {
    req.user.name = req.body.name || req.user.name;
    req.user.image = req.body.image || req.user.image;
    req.user.currentLocation =
      req.body.currentLocation || req.user.currentLocation;
    req.user.gender = req.body.gender || req.user.gender;
    req.user.dateOfBirth = req.body.dateOfBirth || req.user.dateOfBirth;
    req.user.mobileNumber = req.body.mobileNumber || req.user.mobileNumber;
    req.user.careerPreference =
      req.body.careerPreference || req.user.careerPreference;
    req.user.education = req.body.education || req.user.education;
    req.user.skills = req.body.skills || req.user.skills;
    req.user.language = req.body.language || req.user.language;
    req.user.experience = req.body.experience || req.user.experience;
    req.user.project = req.body.project || req.user.project;
    req.user.summary = req.body.summary || req.user.summary;
    req.user.achievements = req.body.achievements || req.user.achievements;
    req.user.resumeLink = req.body.resumeLink || req.user.resumeLink;
    req.user.githubLink = req.body.githubLink || req.user.githubLink;
    req.user.portfolioLink = req.body.portfolioLink || req.user.portfolioLink;
    req.user.codingProfileLink =
      req.body.codingProfileLink || req.user.codingProfileLink;
    req.user.preferredJob = req.body.preferredJob || req.user.preferredJob;
    req.user.typeOfUser = req.body.typeOfUser || req.user.typeOfUser;
    req.user.fcmToken = req.body.fcmToken || req.user.fcmToken;
    req.user.certificateEarned =
      req.body.certificateEarned || req.user.certificateEarned;
    const user = req.user;
    await user.save();

    user.password = undefined;
    user.OTPValidTill = undefined;
    user.OTPVerification = undefined;
    user.ChangePassword = undefined;
    user.VerifiedUser = undefined;
    const resp = {
      status: 'success',
      data: {
        data: user,
      },
    };

    res.status(201).json(resp);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    user.password = undefined;
    user.OTPValidTill = undefined;
    user.OTPVerification = undefined;
    user.ChangePassword = undefined;
    user.VerifiedUser = undefined;
    const response = {
      status: 'success',
      timeLeft: req.timeLeft,
      data: {
        data: user,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const deleteMe = async (req, res, next) => {
  try {
    const email = req.user.email;

    await UserModel.deleteOne({ email });

    res.status(204).json({ status: 'success' });
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
module.exports = {
  updateMe,
  getMe,
  deleteMe,
};
