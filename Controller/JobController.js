const JobModel = require('./../Model/JobModel');
const JobPostedModel = require('../Model/JobPostedModel');
const JobAppliedModel = require('../Model/JobAppliedModel');
const ErrorClass = require('./../Utils/ErrorClass');
const createJob = async (req, res, next) => {
  try {
    if (req.user.typeOfUser !== 'Recruiter') {
      return next(new ErrorClass('You are not allowed to post jobs', 400));
    }
    const {
      nameOfCompany,
      aboutCompany,
      nameOfRole,
      typeOfJob,
      location,
      startDate,
      durationOfInternship,
      costToCompany,
      lastDateToApply,
      descriptionAboutRole,
      skillsRequired,
      noOfOpening,
      perks,
      responsibilities,
      roleCategory,
      minimumQualification,
      companyLinks,
    } = req.body;

    const jobData = await JobModel.create({
      nameOfCompany,
      aboutCompany,
      nameOfRole,
      typeOfJob,
      location,
      startDate,
      durationOfInternship,
      costToCompany,
      lastDateToApply,
      descriptionAboutRole,
      skillsRequired,
      noOfOpening,
      perks,
      responsibilities,
      roleCategory,
      minimumQualification,
      companyLinks,
    });

    await JobPostedModel.create({
      recruiterEmail: req.user.email,
      JobId: jobData._id,
    });

    const response = {
      status: 'success',
      data: {
        data: jobData,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const getAllPostedJobForParticularRecruiter = async (req, res, next) => {
  const email = req.user.email;
  const query = req.query;

  const limit = query.limit * 1 || 5;
  const skip = query.skip * 1 || 0;

  if (limit <= 0 || skip < 0) {
    return next(new ErrorClass('Invalid Skip or limit value', 400));
  }
  let data = await JobPostedModel.find({ recruiterEmail: email })
    .populate('JobId')
    .limit(limit)
    .skip(skip * limit)
    .sort({ postedDate: -1 });
  for (let i = 0; i < data.length; i++) {
    if (data[i].JobId.appliedUserId != null)
      data[i].JobId.appliedUserId = undefined;
  }
  const response = {
    status: 'success',
    length: data.length,
    data: {
      data,
    },
  };
  res.status(200).json(response);
};
const searchJobs = async (req, res, next) => {
  try {
    const query = req.query;
    const limit = query.limit * 1 || 10;
    const skip = query.skip * 1 || 0;

    if (limit < 0 || skip < 0) {
      return next(
        new ErrorClass('Please enter limit or skip greater then 0', 400)
      );
    }

    const todayDate = Date.now();
    const queryParameter = {
      lastDateToApply: { $gt: todayDate },
    };

    if (query.preferredJobType) {
      const preferredJob = query.preferredJobType.split(',');
      queryParameter.roleCategory = { $in: preferredJob };
    }
    if (query.typeOfJob) {
      const typeOfJob = query.typeOfJob.split(',');
      queryParameter.typeOfJob = { $in: typeOfJob };
    }
    if (query.location) {
      let location = query.location.split(',');
      location = location.map((el) => new RegExp(el, 'i'));
      queryParameter.location = { $in: location };
    }

    if (query.skill) {
      let skills = query.skill.split(',');
      skills = skills.map((el) => new RegExp(el, 'i'));
      queryParameter.skillsRequired = { $in: skills };
    }
    if (query.companyNames) {
      let companyNames = query.companyNames.split(',');
      companyNames = companyNames.map((el) => new RegExp(el, 'i'));
      queryParameter.nameOfCompany = { $in: companyNames };
    }
    let data = await JobModel.find(queryParameter)
      .skip(limit * skip)
      .limit(limit)
      .sort({ postedDate: -1 })
      .select('-appliedUserId');

    const resp = {
      status: 'success',
      data: {
        data,
      },
    };

    res.status(200).json(resp);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const applyJob = async (req, res, next) => {
  try {
    const jobId = req.body.id;

    if (!jobId) {
      return next(new ErrorClass('please pass JobId', 400));
    }
    const userId = req.user._id;
    const job = await JobModel.findOne({ _id: jobId });

    if (job.appliedUserId.includes(userId)) {
      return next(new ErrorClass('Applied already', 400));
    }
    job.appliedUserId.push(userId);
    await JobAppliedModel.create({ userId, jobAppliedId: jobId });
    await job.save();
    const response = {
      status: 'success',
      message: 'successfully applied',
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const getAllAppliedJobForParticularUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const query = req.query;

    const limit = query.limit * 1 || 5;
    const skip = query.skip * 1 || 0;

    if (limit <= 0 || skip < 0) {
      return next(new ErrorClass('Invalid Skip or limit value', 400));
    }
    let data = await JobAppliedModel.find({ userId: id })
      .populate('jobAppliedId')
      .limit(limit)
      .skip(skip * limit)
      .sort({ postedDate: -1 });
    for (let i = 0; i < data.length; i++) {
      if (data[i].jobAppliedId.appliedUserId != null)
        data[i].jobAppliedId.appliedUserId = undefined;
    }
    const response = {
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    };
    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const seeAllApplicantsForParticularJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const query = req.query;
    if (!jobId) {
      return next(new ErrorClass('Please pass the jobId', 400));
    }
    const limit = query.limit || 10;
    const skip = query.skip || 0;

    if (limit <= 0 || skip < 0) {
      return next(new ErrorClass('Invalid Skip or limit value', 400));
    }
    let queryParams = {
      jobAppliedId: jobId,
    };
    if (query.type) {
      const t = query.type.split(',');
      queryParams.type = { $in: t };
    }
    const data = await JobAppliedModel.find(queryParams)
      .populate('userId')
      .limit(limit)
      .skip(limit * skip)
      .sort('-postedDate');

    const response = {
      status: 'success',
      data: {
        data,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const setStatus = async (req, res, next) => {
  try {
    const recruiterEmail = req.user.email;

    const { status, jobId, userId } = req.body;

    if (!status || !jobId || !userId) {
      return next(
        new ErrorClass('Please enter status or jobId or userId', 400)
      );
    }

    const jobData = await JobPostedModel.findOne({
      recruiterEmail: recruiterEmail,
      JobId: jobId,
    });
    if (!jobData) {
      return next(
        new ErrorClass(
          'Either jobId is incorrect or your are not the one who posted this job',
          401
        )
      );
    }
    const appliedData = await JobAppliedModel.findOne({
      userId,
      jobAppliedId: jobId,
    });

    if (!appliedData) {
      return next(new ErrorClass('User not applied for this job', 400));
    }
    appliedData.type = status;
    await appliedData.save();

    const response = {
      status: 'success',
      message: 'successfully update the status',
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
const stopResponses = async (req, res, next) => {
  try {
    const jobId = req.body.jobId;
    const recruiterEmail = req.user.email;
    if (!jobId) {
      return next(new ErrorClass('jobId is not given', 400));
    }

    const jobData = await JobPostedModel.findOne({
      recruiterEmail: recruiterEmail,
      JobId: jobId,
    });
    if (!jobData) {
      return next(
        new ErrorClass(
          'Either jobId is incorrect or your are not the one who posted this job',
          401
        )
      );
    }
    const todayDate = Date.now();
    await JobModel.findOneAndUpdate(
      { _id: jobId },
      {
        lastDateToApply: todayDate,
      }
    );

    const response = {
      status: 'success',
      message: 'successfully Update',
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
module.exports = {
  createJob,
  getAllPostedJobForParticularRecruiter,
  searchJobs,
  applyJob,
  getAllAppliedJobForParticularUser,
  seeAllApplicantsForParticularJob,
  setStatus,
  stopResponses,
};
