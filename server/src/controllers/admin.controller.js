

import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

// User Management
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || 'all';
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role !== 'all') {
      query.roles = role;
    }
    
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('name email type roles currentRole avatarUrl yearsOfExp location companyId createdAt')
      .populate('companyId', 'name')
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await User.countDocuments(query);
    res.json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, type, roles, currentRole, yearsOfExp, location } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(400, 'Email already exists');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      type,
      roles: ['seeker', 'referrer'],
      currentRole: 'seeker',
      yearsOfExp,
      location,
    });
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        roles: user.roles,
        currentRole: user.currentRole,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, roles, currentRole, yearsOfExp, location } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { name, roles, currentRole, yearsOfExp, location },
      { new: true, runValidators: true }
    ).select('name email type roles currentRole');
    
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw createError(404, 'User not found');
    }
    
    await Application.deleteMany({ seekerId: id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Job Management
export const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (status !== 'all') {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .select('title companyId status type postedBy applicationCount createdAt')
      .populate('companyId', 'name logoUrl')
      .populate('postedBy', 'name')
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Job.countDocuments(query);
    res.json({
      success: true,
      jobs,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { title, description, companyId, status, type, employmentType, jobLevel, location, remote, skillsRequired, openings } = req.body;
    
    const job = await Job.create({
      title,
      description,
      companyId,
      status: status || 'active',
      type,
      employmentType,
      jobLevel,
      location,
      remote,
      skillsRequired,
      openings,
      postedBy: req.user._id, // assuming req.user is set by auth middleware
    });
    
    await Company.findByIdAndUpdate(companyId, { $inc: { totalJobs: 1 } });
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, title, description, openings } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      id,
      { status, title, description, openings },
      { new: true }
    );
    
    if (!job) {
      throw createError(404, 'Job not found');
    }
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      throw createError(404, 'Job not found');
    }
    
    await Company.findByIdAndUpdate(job.companyId, { $inc: { totalJobs: -1 } });
    await Application.deleteMany({ jobId: id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Application Management
export const getApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    let applications;
    
    if (search) {
      const jobs = await Job.find({ $text: { $search: search } }).select('_id');
      const jobIds = jobs.map(job => job._id);
      const users = await User.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const userIds = users.map(user => user._id);
      query.$or = [{ jobId: { $in: jobIds } }, { seekerId: { $in: userIds } }];
    }
    
    applications = await Application.find(query)
      .select('jobId seekerId referrerId status createdAt')
      .populate({
        path: 'jobId',
        select: 'title companyId',
        populate: { path: 'companyId', select: 'name' },
      })
      .populate('seekerId', 'name email')
      .populate('referrerId', 'name')
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Application.countDocuments(query);
    res.json({
      success: true,
      applications,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({
        path: 'jobId',
        select: 'title',
      })
      .populate('seekerId', 'name');
    
    if (!application) {
      throw createError(404, 'Application not found');
    }
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

// Analytics
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, activeJobs, applicationStatusCounts] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
      ]),
    ]);
    
    const statusCounts = applicationStatusCounts.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, { applied: 0, shortlisted: 0, hired: 0, rejected: 0 });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        activeJobs,
        applicationStatusCounts: statusCounts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const range = req.query.range || "month";
    const dateFormat =
      range === "week" ? "%Y-%m-%d" : range === "month" ? "%Y-%m" : "%Y";

    const [applicationTrends, userTrends, jobTrends] = await Promise.all([
      Application.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
      Job.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
    ]);

    // 🔥 Collect all unique dates across the 3 datasets
    const datesSet = new Set([
      ...applicationTrends.map((t) => t.date),
      ...userTrends.map((t) => t.date),
      ...jobTrends.map((t) => t.date),
    ]);
    const allDates = Array.from(datesSet).sort();

    // 🔧 Normalize so each dataset has counts for every date
    const normalize = (arr) =>
      allDates.map((date) => ({
        date,
        count: arr.find((item) => item.date === date)?.count || 0,
      }));

    res.json({
      success: true,
      trends: {
        applications: normalize(applicationTrends),
        users: normalize(userTrends),
        jobs: normalize(jobTrends),
      },
    });
  } catch (err) {
    next(err);
  }
};


// System Settings
export const getRoles = async (req, res, next) => {
  try {
    res.json({
      success: true,
      roles: ['seeker', 'referrer', 'hr', 'admin'],
    });
  } catch (err) {
    next(err);
  }
};

// Error handling
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Server error',
    status,
  });
};
