const express = require('express');
const router = express.Router();

const JobController = require('./../Controller/JobController');
const AuthController = require('./../Controller/AuthController');

router.use(AuthController.protect);

router.route('/').post(JobController.createJob);
router.route('/').get(JobController.getAllPostedJobForParticularRecruiter);
router.route('/searchJobs').get(JobController.searchJobs);
router
  .route('/appliedJobs')
  .get(JobController.getAllAppliedJobForParticularUser);
router.route('/apply').post(JobController.applyJob);
router
  .route('/appliedUserList/:id')
  .get(JobController.seeAllApplicantsForParticularJob);
router.route('/setStatus').post(JobController.setStatus);
router.route('/stopResponse').post(JobController.stopResponses);
router.route('/saveLater').post(JobController.saveLater);
router.route('/getAllSavedLaterJobs').get(JobController.getAllSaveLaterJobs);
router.route('/getAllJobTypes').get(JobController.allJobTypesAvailable);

module.exports = router;
