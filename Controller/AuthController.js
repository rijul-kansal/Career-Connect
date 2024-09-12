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

    if (!email || !otp) {
      return next(new ErrorClass('Please enter email or otp', 401));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new ErrorClass('Please enter correct email address', 404));
    }
    if (user.VerifiedUser) {
      user.OTPValidTill = undefined;
      user.OTPVerification = undefined;
      user.save();
      return next(new ErrorClass('User already Verified Successfully', 400));
    }
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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorClass('Please enter email or password', 400));
    }
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await promisify(bcrypt.compare)(password, user.password))) {
      return next(new ErrorClass('Please check your email or password', 404));
    }
    if (!user.VerifiedUser) {
      return next(new ErrorClass('Please verify your email first', 401));
    }

    const token = jwt.sign({ data: user.email }, process.env.JWT_SECRET, {
      expiresIn: '10d',
    });
    user.password = undefined;
    user.VerifiedUser = undefined;
    user.OTPValidTill = undefined;
    user.ChangePassword = undefined;
    const response = {
      status: 'success',
      message: 'Successfully login',
      data: {
        data: user,
      },
      token,
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const protect = async (req, res, next) => {
  try {
    const param = req.headers.authorization;
    if (!param) {
      return next(new ErrorClass('Please login first', 400));
    }

    const jwtToken = param.split(' ')[1];

    if (!jwtToken) {
      return next(new ErrorClass('Please pass token in headers', 401));
    }
    let jwtVerification;
    try {
      jwtVerification = jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (err) {
      if (
        err.message === 'invalid signature' ||
        err.message === 'jwt expired'
      ) {
        return next(new ErrorClass('Please login Again .'));
      }
    }
    // console.log(jwtVerification);
    const email = jwtVerification.data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }

    if (user.ChangePassword > jwtVerification.iat * 1000) {
      return next(new ErrorClass('Please Login again', 401));
    }

    req.user = user;
    req.timeLeft = Math.ceil(
      Math.abs(
        (Date.now() - jwtVerification.exp * 1000) / (24 * 60 * 60 * 1000)
      )
    );
    // console.log(req.timeLeft);
    next();
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const resendOTPOrForgottenPassword = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    if (!email || !type) {
      return next(new ErrorClass('Please enter email or type', 400));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new ErrorClass('User with this email does not exist', 404));
    }

    const otp = SpecialFns.generateOTP();
    user.OTPValidTill = Date.now() + 300000;
    user.OTPVerification = otp;
    user.save();

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
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return next(new ErrorClass('Please enter all the required field', 400));
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }

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
const changePassword = async (req, res, next) => {
  try {
    const { newPass, oldPass } = req.body;

    if (!newPass || !oldPass) {
      return next(new ErrorClass('Please enter all the required field', 400));
    }
    const email = req.user.email;
    console.log(email);
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorClass('User does not exist', 404));
    }
    if (!user.VerifiedUser) {
      return next(new ErrorClass('Please verify your email first', 401));
    }
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
