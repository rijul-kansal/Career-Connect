const express = require('express');
const router = express.Router();

const ChatController = require('./../Controller/ChatController');
const AuthController = require('./../Controller/AuthController');
router.use(AuthController.protect);
router.route('/:id').get(ChatController.getMessages);
module.exports = router;
