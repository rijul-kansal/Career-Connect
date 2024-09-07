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
// no of students applied left
const getAllPostedJobForParticularRecruiter = async (req, res, next) => {
  const email = req.user.email;
  const query = req.query;

  const limit = query.limit * 1 || 5;
  const skip = query.skip * 1 || 0;

  if (limit <= 0 || skip < 0) {
    return next(new ErrorClass('Invalid Skip or limit value', 400));
  }
  const data = await JobPostedModel.find({ recruiterEmail: email })
    .populate('JobId')
    .limit(limit)
    .skip(skip * limit)
    .sort({ postedDate: -1 });
  const response = {
    status: 'success',
    length: data.length,
    data: {
      data,
    },
  };
  res.status(200).json(response);
};
// no of students applied left
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
    console.log(queryParameter);
    const data = await JobModel.find(queryParameter)
      .skip(limit * skip)
      .limit(limit)
      .sort({ postedDate: -1 });
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
    const jobId = req._id;
    const userId = req.user._id;

    await JobAppliedModel.create({ userEmail });
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
module.exports = {
  createJob,
  getAllPostedJobForParticularRecruiter,
  searchJobs,
};
