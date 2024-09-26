const express = require('express');
const AuthController = require('./../Controller/AuthController');
const router = express.Router();

router.route('/SignUp').post(AuthController.createUser);
router.route('/verifyOTP').post(AuthController.verifyOTP);
router.route('/login').post(AuthController.login);
router.route('/protect').post(AuthController.protect);
router.route('/resetPassword').patch(AuthController.resetPassword);
router
  .route('/resendOTPOrForgottenPassword')
  .patch(AuthController.resendOTPOrForgottenPassword);
router.use(AuthController.protect);
router.route('/changePassword').patch(AuthController.changePassword);
router.route('/refreshToken').post(AuthController.refreshJWTToken);
module.exports = router;
