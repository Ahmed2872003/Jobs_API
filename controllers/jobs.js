const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, ConflictError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });

  if (!jobs.length) throw new NotFoundError("No jobs have been created yet");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { id: userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOne({ _id: jobID, createdBy: userID });

  if (!job) throw new NotFoundError(`No job with id: ${jobID}`);

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  req.body.createdBy = req.user.id;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, status },
    user: { id: userID },
    params: { id: jobID },
  } = req;

  if (!company || !status)
    throw new BadRequestError("Please provide company or status");

  const job = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) throw new NotFoundError(`No job with id: ${jobID}`);

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { id: userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobID, createdBy: userID });

  if (!job) throw new NotFoundError(`No job with id: ${jobID}`);

  res.status(StatusCodes.OK).json({ msg: "Deleted successfully" });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
