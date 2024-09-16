const UserModel = require('../Model/UserModel');
const ErrorClass = require('../Utils/ErrorClass');
const Mail = require('./../Utils/NodeMailer');
const Messages = require('./../Utils/Messages');
const SpecialFns = require('./../Utils/SpecialFns');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { promisify } = require('util');

// this api will create a new user in database
const createUser = async (req, res, next) => {
  try {
    const { name, password, email, typeOfUser, mobileNumber } = req.body;
    // otp valid till next 5 min
    const otp = SpecialFns.generateOTP();
    result = await UserModel.create({
      name,
      password,
      email,
      typeOfUser,
      mobileNumber,
      OTPVerification: otp,
      OTPValidTill: Date.now() + 5 * 60 * 1000,
    });
    // these parameter not required
    result.password = undefined;
    result.OTPValidTill = undefined;
    result.OTPVerification = undefined;
    result.ChangePassword = undefined;
    result.VerifiedUser = undefined;
    result.lastUpdated = undefined;
    // sending welcome as well as otp message
    try {
      let message;
      if (result.typeOfUser === 'user')
        message = Messages.welcomeMessageUser(result.name);
      else message = Messages.welcomeMessageRecruiter(result.name);
      Mail(result.email, 'Welcome Email', message);

      Mail(
        result.email,
        'Email Verification',
        Messages.sendOtpEmail(result.name, otp)
      );
    } catch (err) {
      return next(new ErrorClass(err.message, 500));
    }

    const response = {
      status: 'Success',
      data: {
        data: result,
      },
    };
    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// once the user have been created then we have to verify his or her account
// that email that she used is not fake
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // if no email or otp then send error message
    if (!email || !otp) {
      return next(new ErrorClass('Please enter email or otp', 401));
    }
    // getting use
    const user = await UserModel.findOne({ email });
    // if no user exists with the given email
    if (!user) {
      return next(new ErrorClass('Please enter correct email address', 404));
    }
    // if user is already verified
    if (user.VerifiedUser) {
      user.OTPValidTill = undefined;
      user.OTPVerification = undefined;
      user.save();
      return next(new ErrorClass('User already Verified Successfully', 400));
    }
    // else check if otp enter by user is right or wrong
    // as well as opt enter in particular time or not
    // if otp is wrong or limit exceed then send error message
    if (user.OTPVerification === otp && user.OTPValidTill >= Date.now()) {
      user.VerifiedUser = true;
      user.OTPValidTill = undefined;
      user.OTPVerification = undefined;
      user.save();
      const response = {
        status: 'success',
        message: 'Successfully verified user',
      };

      res.status(200).json(response);
    } else if (user.OTPValidTill < Date.now()) {
      const response = {
        status: 'fail',
        message: 'Time Out!!!. Please click on reset button',
      };

      res.status(200).json(response);
    } else {
      const response = {
        status: 'fail',
        message: 'Wrong OTP. Please try again',
      };

      res.status(200).json(response);
    }
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// login user with email and password and send jwt token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // if no email and password then
    if (!email || !password) {
      return next(new ErrorClass('Please enter email or password', 400));
    }

    // check given email is there or not if yes then match password else show error
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await promisify(bcrypt.compare)(password, user.password))) {
      return next(new ErrorClass('Please check your email or password', 404));
    }

    // also check if user is verified or not
    if (!user.VerifiedUser) {
      return next(new ErrorClass('Please verify your email first', 401));
    }
    // if user is verified then generate jwt token with validity for 10 days
    const token = jwt.sign({ data: user.email }, process.env.JWT_SECRET, {
      expiresIn: '10d',
    });
    user.password = undefined;
    user.VerifiedUser = undefined;
    user.OTPValidTill = undefined;
    user.ChangePassword = undefined;
    user.lastUpdated = undefined;
    const response = {
      status: 'success',
      token,
      data: {
        data: user,
      },
    };
    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// this fn will help us to protect all routes
const protect = async (req, res, next) => {
  try {
    const param = req.headers.authorization;
    if (!param) {
      return next(
        new ErrorClass('Please login first or pass token in headers', 400)
      );
    }

    const jwtToken = param.split(' ')[1];
    if (!jwtToken) {
      return next(new ErrorClass('Please pass token in headers', 401));
    }
    // verify jwt is valid or not if valid extract data
    let jwtVerification;
    try {
      jwtVerification = jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (err) {
      if (
        err.message === 'invalid signature' ||
        err.message === 'jwt expired'
      ) {
        return next(new ErrorClass('Please login Again.'));
      }
    }
    const email = jwtVerification.data;
    // getting user associated with particular jwt
    const user = await UserModel.findOne({ email });

    // if no user then error message
    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }
    // if user have change password then ask user to generate now jwt token
    // due to security reason
    if (user.ChangePassword > jwtVerification.iat * 1000) {
      return next(new ErrorClass('Please Login again', 401));
    }
    // assigning user for future reference
    req.user = user;
    // time left to again login to user
    req.timeLeft = Math.ceil(
      Math.abs(
        (Date.now() - jwtVerification.exp * 1000) / (24 * 60 * 60 * 1000)
      )
    );
    next();
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// this fn is used for resending otp
// for forgotten password or when time exceed
const resendOTPOrForgottenPassword = async (req, res, next) => {
  try {
    const { email, type } = req.body;

    // check if user enter all parameter or not
    if (!email || !type) {
      return next(new ErrorClass('Please enter email or type', 400));
    }
    // get user from db
    const user = await UserModel.findOne({ email });
    // check if particular user exists in db or not
    if (!user) {
      return next(new ErrorClass('User with this email does not exist', 404));
    }
    // generate otp
    const otp = SpecialFns.generateOTP();
    // time = 5 min
    user.OTPValidTill = Date.now() + 300000;
    user.OTPVerification = otp;

    // save in db
    await user.save();
    // sending personalized email
    try {
      if (type !== 'forgottenPassword')
        Mail(email, 'Email Verification', Messages.resendOTP(user.name, otp));
      else
        Mail(
          email,
          'ForgottenPassword',
          Messages.sendForgotPasswordEmail(user.name, otp)
        );
    } catch (err) {
      return next(new ErrorClass(err.message, 400));
    }

    const response = {
      status: 'success',
      message: 'successfully send OTP , Please check your email id',
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// Reset password when user forgot password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    // if not all params enter by user then display error message
    if (!email || !otp || !password) {
      return next(new ErrorClass('Please enter all the required field', 400));
    }
    // get user with password
    const user = await UserModel.findOne({ email }).select('+password');
    // if no user exists then returning error message
    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }
    // check if opt enter by user matching with otp saved in Db
    // and time limit does not exceed

    if (user.OTPVerification === otp && user.OTPValidTill >= Date.now()) {
      user.OTPValidTill = undefined;
      user.OTPVerification = undefined;
      user.VerifiedUser = true;
      user.password = password;
      user.ChangePassword = Date.now();
      await user.save();
    } else if (user.OTPValidTill < Date.now()) {
      const response = {
        status: 'fail',
        message: 'Time Out!!!. Please click on reset button',
      };

      res.status(200).json(response);
    } else {
      return next(new ErrorClass('Please check your email or otp', 401));
    }

    const response = {
      status: 'success',
      message: 'password change successfully',
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// change password by entering old password and new password
const changePassword = async (req, res, next) => {
  try {
    const { newPass, oldPass } = req.body;
    // checking if user enter all params or not
    if (!newPass || !oldPass) {
      return next(new ErrorClass('Please enter all the required field', 400));
    }

    // getting email from jwl token
    const email = req.user.email;

    // getting user with password
    const user = await UserModel.findOne({ email }).select('+password');
    // if user does not exists then return error
    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }

    // if user is not verified then also return error
    if (!user.VerifiedUser) {
      return next(new ErrorClass('Please verify your email first', 401));
    }

    // compare old password with hashed password
    // if matches then save new password and change password date to current date
    if (await promisify(bcrypt.compare)(oldPass, user.password)) {
      user.password = newPass;
      user.ChangePassword = Date.now();
      await user.save();
    } else {
      return next(new ErrorClass('password is wrong', 401));
    }

    const response = {
      status: 'success',
      message: 'password change successfully',
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
module.exports = {
  createUser,
  verifyOTP,
  login,
  protect,
  resendOTPOrForgottenPassword,
  resetPassword,
  changePassword,
};
