const express = require('express');
const AuthController = require('./../Controller/AuthController');
const UserController = require('./../Controller/UserController');
const router = express.Router();

router.use(AuthController.protect);
router.route('/').patch(UserController.updateMe);
router.route('/').get(UserController.getMe);
router.route('/').delete(UserController.deleteMe);

module.exports = router;
