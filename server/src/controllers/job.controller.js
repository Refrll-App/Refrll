import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

import mongoose from 'mongoose';

// GET /api/jobs

export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      remote,
      skills,
      type,
      excludePostedBy,
      page = 1,
      limit = 9,
    } = req.query;

    const filter = { isActive: true };

    if (keyword?.trim()) {
      filter.title = { $regex: keyword.trim(), $options: 'i' };
    }

    if (location?.trim()) {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    if (remote === 'true') {
      filter.remote = true;
    }

    if (type?.trim()) {
      filter.type = type.trim();
    }

    if (excludePostedBy) {
      filter.postedBy = { $ne: excludePostedBy };
    }

    if (skills?.length > 0) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());

      filter.skillsRequired = {
        $elemMatch: {
          $regex: skillsArray.join('|'),
          $options: 'i',
        },
      };
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('companyId', 'name logoUrl')
        .populate('postedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalJobs: total,
    });
  } catch (err) {
    console.error('Error in getJobs:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching jobs.',
      error: err.message,
    });
  }
};


// GET /api/jobs/:id

export const getJobById = async (req, res) => {

  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name logoUrl website')
      .populate('postedBy', 'name')
      .lean();

    if (!job) return res.status(404).json({ message: 'Job not found' });

  
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// POST /api/jobs/company   (HR only)
export const createCompanyJob = async (req, res) => {

  try {
    const { title, description, location, remote, salaryRange, skillsRequired,experienceRequired, employmentType,jobLevel } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Missing fields' });

    const job = await Job.create({
      title, description, location, remote, salaryRange, skillsRequired,experienceRequired, employmentType,jobLevel,
      type: 'company',
      companyId: req.user.companyId,
      postedBy: req.user._id,
      expiresAt: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/jobs/referral   (Employee only)
export const createReferralJob = async (req, res) => {

 
  try {
    const { title, description, location, remote, salaryRange, skillsRequired,experienceRequired } = req.body;
    if (!title || !description || !salaryRange.min || !salaryRange.max) {
      return res.status(400).json({ message: 'Missing required fields: title, description, salaryRange.min, salaryRange.max' });
    }

 

    const job = await Job.create({
      title,
      description,
      location,
      remote,
      salaryRange: {
        min: Number(salaryRange.min),
        max: Number(salaryRange.max)
      },
         experienceRequired: {
        min: Number(experienceRequired.min),
        max: Number(experienceRequired.max)
      },
      skillsRequired: skillsRequired.split(',').map(s => s.trim()),
      type: 'referral',
      companyId: req.user.companyId, // 
      postedBy: req.user._id,
      referrerId: req.user._id,
      expiresAt: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    });

    
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Complete your Profile" || 'Failed to create job' });
  }
};


// PUT /api/jobs/:id   (HR only)
export const updateJob = async (req, res) => {
 
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/jobs/:id   (HR only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/jobs/:id/claim   (Employee only)

export const claimJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const companyJob = await Job.findById(jobId);
    if (!companyJob) return res.status(404).json({ message: 'Job not found' });
    if (companyJob.type !== 'company') return res.status(400).json({ message: 'Can only claim company jobs' });

    const employee = await User.findById(req.user._id);

    if (String(companyJob.companyId) !== String(employee.companyId)) {
      return res.status(403).json({ message: 'Search for you company' });
    }

    const existingReferral = await Job.findOne({
      companyId: companyJob.companyId,
      type: 'referral',
      postedBy: req.user._id,
      jobId: companyJob._id
    });

    if (existingReferral) {
      return res.status(400).json({ message: 'You have already claimed this job' });
    }


      // Update applicationCount in Job model
        await Job.findByIdAndUpdate(jobId, { $inc: { claimedByCount: 1 } });

    const referralJob = await Job.create({
      title: companyJob.title,
      description: companyJob.description,
      location: companyJob.location,
      remote: companyJob.remote,
      salaryRange: companyJob.salaryRange,
      skillsRequired: companyJob.skillsRequired,
      experienceRequired: companyJob.experienceRequired,
      type: 'referral',
      companyId: companyJob.companyId,
      postedBy: req.user._id,
      referrerId: req.user._id,
      jobId: companyJob._id,
      applicationCount: 0,
      claimCount: 0
    });

    res.status(201).json(referralJob);
  } catch (err) {
    console.error('Error in claimJob:', err);
    res.status(500).json({ message: 'Something went wrong while claiming the job.' });
  }
};



export const getClaimableCompanyJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 12,
      search = '',
      experience = '',
      skills = ''
    } = req.query;
  

    const skip = (page - 1) * limit;
    const filters = {
      type: 'company',
      isActive: true
    };

    // Search filter (title, location, or skill)
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filters.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { skillsRequired: { $elemMatch: { $regex: searchRegex } } }
      ];
    }

    // Skill-specific filter (can override $or if both used)
    if (skills) {
      const skillRegex = new RegExp(skills.trim(), 'i');
      filters.skillsRequired = { $elemMatch: { $regex: skillRegex } };
    }

    // Experience filter
    if (experience === '10+') {
      filters['experienceRequired.min'] = { $gte: 10 };
    } else if (experience.includes('-')) {
      const [min, max] = experience.split('-').map(Number);
      filters['experienceRequired.min'] = { $gte: min };
      filters['experienceRequired.max'] = { $lte: max };
    }

    // Fetch paginated jobs
    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('companyId', 'name logoUrl')
      .lean();

    // Get claimed job IDs by this user
    const claimedJobs = await Job.find({
      type: 'referral',
      postedBy: userId,
      jobId: { $in: jobs.map((job) => job._id) }
    }).select('jobId').lean();

    const claimedJobIds = new Set(claimedJobs.map(job => job.jobId.toString()));

    const enrichedJobs = jobs.map((job) => ({
      ...job,
      company: job.companyId,
      claimedByMe: claimedJobIds.has(job._id.toString())
    }));

    const total = await Job.countDocuments(filters);

    res.json({
      jobs: enrichedJobs,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error('Error fetching claimable jobs:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// GET /api/jobs/my-referrals

export const getMyReferrals = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {
      postedBy: req.user._id,
      type: 'referral',
    };

    const [jobs, totalCount] = await Promise.all([
      Job.find(filter)
        .populate('companyId', 'name logoUrl website')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      jobs,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching referral jobs:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};


// controllers/jobController.js

export const getHrJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      postedBy: req.user._id,
      type: 'company'
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const jobs = await Job.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'jobId',
          as: 'applications'
        }
      },
      {
        $addFields: {
          applicationCount: { $size: '$applications' }
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      {
        $unwind: {
          path: '$company',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limitNum },
      {
        $project: {
          title: 1,
          location: 1,
          remote: 1,
          status: 1,
          createdAt: 1,
          salaryRange: 1,
          skillsRequired: 1,
          applicationCount: 1,
          company: {
            name: '$company.name',
            logoUrl: '$company.logoUrl',
            website: '$company.website'
          }
        }
      }
    ]);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getHrDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [metrics] = await Job.aggregate([
      { $match: { postedBy: userId, type: 'company' } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'jobId',
          as: 'applications'
        }
      },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalApplications: { $sum: { $size: '$applications' } },
          avgSalary: { $avg: { $avg: ['$salaryRange.min', '$salaryRange.max'] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalJobs: 1,
          totalApplications: 1,
          avgSalary: { $round: ['$avgSalary', 0] }
        }
      }
    ]);

    // Add change percentages (you can implement more complex logic here)
    const result = metrics ? {
      ...metrics,
      jobChange: 12, // Example percentage
      applicationChange: 8, // Example percentage
      salaryChange: 5 // Example percentage
    } : {
      totalJobs: 0,
      totalApplications: 0,
      avgSalary: 0,
      jobChange: 0,
      applicationChange: 0,
      salaryChange: 0
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getApplicationsForHrJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || '';
    const status = req.query.status || 'all';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    const query = { jobId: new mongoose.Types.ObjectId(jobId) };

    if (status !== 'all') {
      query.status = status;
    }

    if (search) {
      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      query.seekerId = { $in: matchedUsers.map(user => user._id) };
    }

    const sortOptions = {};
    if (sort === 'yearsOfExp') {
      sortOptions['seekerId.yearsOfExp'] = order;
    } else {
      sortOptions[sort] = order;
    }

    const applications = await Application.find(query)
      .populate('seekerId', 'name email resumeUrl skills yearsOfExp')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Application.countDocuments(query);

    const statusCountsAgg = await Application.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };

    statusCountsAgg.forEach(({ _id, count }) => {
      statusCounts[_id] = count;
    });

    statusCounts.all = totalCount;

    res.json({
      applications,
      totalCount,
      statusCounts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit
    });
  } catch (err) {
    console.error('Error in getApplicationsForHrJob:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};