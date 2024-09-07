const express = require('express');
const router = express.Router();

const JobController = require('./../Controller/JobController');
const AuthController = require('./../Controller/AuthController');

router.use(AuthController.protect);

router.route('/').post(JobController.createJob);
router.route('/').get(JobController.getAllPostedJobForParticularRecruiter);
router.route('/searchJobs').get(JobController.searchJobs);

module.exports = router;
