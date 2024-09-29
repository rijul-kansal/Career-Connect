const JobModel = require('./../Model/JobModel');
const UserModel = require('./../Model/UserModel');
const JobPostedModel = require('../Model/JobPostedModel');
const JobAppliedModel = require('../Model/JobAppliedModel');
const SaveLaterModel = require('../Model/SaveLaterModel');
const ErrorClass = require('./../Utils/ErrorClass');
const Mail = require('./../Utils/NodeMailer');
const Messages = require('./../Utils/Messages');

// this fn will check if user already applied or not
function checkAppliedJob(appliedJobs, jobId) {
  for (let i = 0; i < appliedJobs.length; i++) {
    if (String(appliedJobs[i].jobAppliedId) === String(jobId)) {
      return false;
    }
  }

  return true;
}
// this fn will return time stamp of that particular day of 12 am
function getToday12Am() {
  var currentTime = new Date();
  var currentOffset = currentTime.getTimezoneOffset();

  var ISTOffset = 330;
  var ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  var h = ISTTime.getHours();
  var m = ISTTime.getMinutes();
  const time = Date.now() - h * 60 * 60 * 1000 - m * 60 * 1000;
  return time;
}
// this fn add new ob data in DB
const createJob = async (req, res, next) => {
  try {
    // if type of user is not Recruiter then that user is not allowed
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
    // saving data into DB
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
    // Create record who posted which job
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
// This fn will retrieve all the jobs posted by single recruiter
const getAllPostedJobForParticularRecruiter = async (req, res, next) => {
  // getting email and query params
  const email = req.user.email;
  const query = req.query;
  // if limit is given then its ok else only retrieve 5 records at a time
  const limit = query.limit * 1 || 5;
  // if skip is given then its ok else else start from starting
  const skip = query.skip * 1 || 0;
  // checking invalid params
  if (limit <= 0 || skip < 0) {
    return next(new ErrorClass('Invalid Skip or limit value', 400));
  }

  // getting jobs with full records in sorted order in descending order
  let data = await JobPostedModel.find({ recruiterEmail: email })
    .populate('JobId')
    .limit(limit)
    .skip(skip * limit)
    .sort({ postedDate: -1 });

  // removing extra params in response
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
// search jobs so that anyone can apply
const searchJobs = async (req, res, next) => {
  try {
    // retrieving query params
    const query = req.query;
    const limit = query.limit * 1 || 10;
    const skip = query.skip * 1 || 0;
    // check if no -ve value is there or not
    if (limit < 0 || skip < 0) {
      return next(
        new ErrorClass('Please enter limit or skip greater then 0', 400)
      );
    }
    // getting only those jobs who date does not exceed
    const todayDate = Date.now();
    const queryParameter = {
      lastDateToApply: { $gt: todayDate },
    };
    // if user put any preferred job type then add in query params
    if (query.preferredJobType) {
      const preferredJob = query.preferredJobType.split(',');
      queryParameter.roleCategory = { $in: preferredJob };
    }

    // if user put any specific type of job then put in query params
    if (query.typeOfJob) {
      const typeOfJob = query.typeOfJob.split(',');
      queryParameter.typeOfJob = { $in: typeOfJob };
    }

    // any particular location he / she wants
    if (query.location) {
      let location = query.location.split(',');
      location = location.map((el) => new RegExp(el, 'i'));
      queryParameter.location = { $in: location };
    }
    // looking for any particular skills type of job
    if (query.skill) {
      let skills = query.skill.split(',');
      skills = skills.map((el) => new RegExp(el, 'i'));
      queryParameter.skillsRequired = { $in: skills };
    }

    // looking for any particular company
    if (query.companyNames) {
      let companyNames = query.companyNames.split(',');
      companyNames = companyNames.map((el) => new RegExp(el, 'i'));
      queryParameter.nameOfCompany = { $in: companyNames };
    }

    // looking for only those jobs whose applied user is  < 50
    if (query.easyApply) {
      queryParameter.noOfStudentsApplied = { $lt: 50 };
    }

    // based on posted date only
    // if 1 then last 24 hours
    // if 2 then last 3 days
    // if 3 then last 30 days
    if (query.time) {
      let time;
      if (query.time === '1') {
        time = getToday12Am() - 24 * 3600000;
        queryParameter.postedDate = { $gte: time };
      } else if (query.time === '2') {
        time = getToday12Am() - 3 * 24 * 3600000;
        queryParameter.postedDate = { $gte: time };
      } else if (query.time === '3') {
        time = getToday12Am() - 7 * 24 * 3600000;
        queryParameter.postedDate = { $gte: time };
      }
    }

    // getting jobs data
    const totalJobs = await JobModel.countDocuments(queryParameter);
    let data = await JobModel.find(queryParameter)
      .skip(limit * skip)
      .limit(limit)
      .sort({ postedDate: -1 })
      .select('-appliedUserId');

    // elimination those jobs which was applied by user
    let appliedJobs = await JobAppliedModel.find({
      userId: req.user._id,
    }).select('jobAppliedId');

    data = data.filter((ele) => checkAppliedJob(appliedJobs, ele._id));
    const resp = {
      status: 'success',
      totalJobs,
      length: data.length,
      data: {
        data,
      },
    };

    res.status(200).json(resp);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
// this fn will help user to apply for particular job
const applyJob = async (req, res, next) => {
  try {
    const jobId = req.body.id;
    // check if user put all params or not
    if (!jobId) {
      return next(new ErrorClass('please pass JobId', 400));
    }
    const userId = req.user._id;

    // get particular job
    const job = await JobModel.findOne({ _id: jobId });
    if (!job) {
      return next(new ErrorClass('Job Id is invalid', 400));
    }
    // checking if user applied or not
    if (job.appliedUserId.includes(userId)) {
      return next(new ErrorClass('Applied already', 400));
    }

    // adding job in list as well as applied db as well
    job.appliedUserId.push(userId);
    await JobAppliedModel.create({ userId, jobAppliedId: jobId });
    await job.save();

    // if user successfully applied the remove from saved also
    await SaveLaterModel.deleteOne({ userId, jobId });
    const response = {
      status: 'success',
      message: 'successfully applied',
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
// this fn will help us to get all applied job for particular user
const getAllAppliedJobForParticularUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const query = req.query;
    // if no limit or skip is given then we define our own limit and skip
    const limit = query.limit * 1 || 5;
    const skip = query.skip * 1 || 0;

    if (limit < 0 || skip < 0) {
      return next(new ErrorClass('Invalid Skip or limit value', 400));
    }

    // getting data
    let data = await JobAppliedModel.find({ userId: id })
      .populate('jobAppliedId')
      .limit(limit)
      .skip(skip * limit)
      .sort({ postedDate: -1 });

    // removing some extra params in response
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
// this will allow to see all applicants for particular job
const seeAllApplicantsForParticularJob = async (req, res, next) => {
  try {
    const userId = req.user.email;
    const jobId = req.params.id;
    const query = req.query;
    if (!jobId) {
      return next(new ErrorClass('Please pass the jobId', 400));
    }
    const limit = query.limit * 1 || 10;
    const skip = query.skip * 1 || 0;

    if (limit < 0 || skip < 0) {
      return next(new ErrorClass('Invalid Skip or limit value', 400));
    }

    // check if particular job is applied by the user or not
    const jobPerson = await JobPostedModel.findOne({
      recruiterEmail: userId,
      JobId: jobId,
    });
    if (!jobPerson) {
      return next(new ErrorClass('You have not posted this job', 401));
    }
    // adding job id in query params
    let queryParams = {
      jobAppliedId: jobId,
    };

    // if type is there then we will only show that params
    if (query.type) {
      const t = query.type.split(',');
      queryParams.type = { $in: t };
    }

    // getting users in ascending orders
    const data = await JobAppliedModel.find(queryParams)
      .populate('userId')
      .limit(limit)
      .skip(limit * skip)
      .sort('postedDate');

    // removing some extra params
    for (ele of data) {
      ele.userId.password = undefined;
      ele.userId.VerifiedUser = undefined;
      ele.userId.OTPValidTill = undefined;
      ele.userId.ChangePassword = undefined;
      ele.userId.lastUpdated = undefined;
      ele.userId.typeOfUser = undefined;
      ele.userId.fcmToken = undefined;
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
// set status for particular application
const setStatus = async (req, res, next) => {
  try {
    // getting required params
    const recruiterEmail = req.user.email;
    const { status, jobId, userId } = req.body;
    // check if all params are there or not
    if (!status || !jobId || !userId) {
      return next(
        new ErrorClass('Please enter status or jobId or userId', 400)
      );
    }

    // check if recruiter post that job or not
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

    // check particular user applied for that particular job or not
    const appliedData = await JobAppliedModel.findOne({
      userId,
      jobAppliedId: jobId,
    });

    if (!appliedData) {
      return next(new ErrorClass('User not applied for this job', 400));
    }

    // updating status and saving again to DB
    appliedData.type = status;
    await appliedData.save();
    // sending Email message to user about particular application
    try {
      if (status === 'Seen' || status === 'Interested') {
        const jobSpecification = await JobModel.findById(jobId);
        const userSpecification = await UserModel.findById(userId);
        Mail(
          userSpecification.email,
          Messages.getEmailSubject(jobSpecification.nameOfCompany, status),
          Messages.companyStatusMessage(
            userSpecification.name,
            jobSpecification.nameOfCompany,
            status
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
    const response = {
      status: 'success',
      message: 'successfully update the status',
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
// this fn will not show particular job again to any user
const stopResponses = async (req, res, next) => {
  try {
    // getting required params
    const jobId = req.body.jobId;
    const recruiterEmail = req.user.email;

    // if required params is not there then throw error
    if (!jobId) {
      return next(new ErrorClass('jobId is not given', 400));
    }
    // check if particular job is given by particular user or not
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

    // updating status so that job will not be seen again
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
// this fn will save jobs for later
const saveLater = async (req, res, next) => {
  try {
    // getting required params
    const userId = req.user._id;
    const jobId = req.body.id;

    // checking if required params is given by user or not
    if (!jobId) {
      return next(new ErrorClass('Please pass jobId', 400));
    }

    // checking if user already saved or not
    const appliedJobs = await SaveLaterModel.findOne({
      userId,
      jobId,
    });
    if (appliedJobs) {
      return next(new ErrorClass('You have Saved already', 400));
    }

    //  else save the job
    await SaveLaterModel.create({ userId, jobId });

    const response = {
      status: 'success',
      message: 'Successfully saved',
    };

    res.status(201).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
// getting all saved jobs
const getAllSaveLaterJobs = async (req, res, next) => {
  try {
    // getting required params
    const query = req.query;
    const userId = req.user._id;

    const limit = query.limit * 1 || 10;
    const skip = query.skip * 1 || 0;

    if (limit < 0 || skip < 0) {
      return next(
        new ErrorClass('Please enter valid value for limit and skip', 400)
      );
    }

    // getting data
    const data = await SaveLaterModel.find({ userId })
      .populate('jobId')
      .limit(limit)
      .skip(limit * skip);

    // removing unwanted params
    for (ele of data) {
      ele.jobId.appliedUserId = undefined;
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
module.exports = {
  createJob,
  getAllPostedJobForParticularRecruiter,
  searchJobs,
  applyJob,
  getAllAppliedJobForParticularUser,
  seeAllApplicantsForParticularJob,
  setStatus,
  stopResponses,
  saveLater,
  getAllSaveLaterJobs,
};
