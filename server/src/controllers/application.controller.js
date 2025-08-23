import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import createNotification from '../utils/createNotification.js';
import ExcelJS from 'exceljs'


// POST /api/applications


export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const seekerId = req.user._id;

    if (!jobId) {
      return res.status(400).json({ message: 'jobId required' });
    }

    const seeker = await User.findById(seekerId);
    if (!seeker || !seeker.resumeUrl) {
      return res.status(400).json({ message: 'Upload resume first' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existing = await Application.findOne({ jobId, seekerId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied' });
    }

    // Referrer quota check
    let referrerId = job.referrerId;
    if (job.type === 'referral') {
      const appliedCount = await Application.countDocuments({ jobId });

      if (appliedCount === 10) {
        return res.status(409).json({ message: 'Referrer quota full (max 10 applications)' });
      }

      if (!referrerId) {
        // fallback to postedBy if referrerId not explicitly stored
        referrerId = job.postedBy;
      }
    }

    // Create application
    const application = await Application.create({
      jobId,
      seekerId,
      referrerId: job.type === 'referral' ? referrerId : null,
      status: 'applied'
    });

    // Update applicationCount in Job model
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Send notifications
    const jobTitle = job.title;

    // Notify seeker
    await createNotification(
      seekerId,
      'Application Submitted',
      `Your application for ${jobTitle} was submitted successfully.`,
      `/jobs/${jobId}`
    );

    // Notify referrer
    if (job.type === 'referral' && referrerId) {
      await createNotification(
        referrerId,
        'New Application Received',
        `${seeker.name} has applied for ${jobTitle}.`,
        `/employee/referrer`
      );
    }


     if (job.type === 'company' && !referrerId) {
      await createNotification(
          job.postedBy,
        'New Application Received',
        `${seeker.name} has applied for ${jobTitle}.`,
        `/hr/dashboard`
      );
    }



   
    res.status(201).json(application);
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Something went wrong while applying.' });
  }
};


// controllers/applicationController.js

export const checkIfApplied = async (req, res) => {
  try {
    const existing = await Application.findOne({
      jobId: req.params.jobId,
      seekerId: req.user._id
    }).select('_id');


    res.json({ applied: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/applications/referrer

export const getReferrerApplications = async (req, res) => {
  try {
    const referralJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = referralJobs.map(job => job._id);

    const apps = await Application.find({
      referrerId: req.user._id,
      jobId: { $in: jobIds },
    })
    .populate('seekerId', 'name email resumeUrl yearsOfExp skills')
    .populate({
      path: 'jobId',
      select: 'title companyId',
      populate: {
        path: 'companyId',
        select: 'name logoUrl'
      }
    })
    .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/applications/me   (Seeker)

export const getMyApplications = async (req, res) => {
  try {
    const seekerId = req.user._id;

    const applications = await Application.find({ seekerId })
      .select('-__v') // optional: exclude __v field
      .populate({
        path: 'jobId',
        select: 'title companyId type location',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
      .populate({
        path: 'referrerId',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching seeker applications:', err);
    res.status(500).json({ message: 'Failed to fetch your applications.' });
  }
};




// PATCH /api/applications/:id/status  (Referrer/HR)
// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'hired'];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const app = await Application.findById(req.params.id).populate('jobId').populate('seekerId', '_id');;
//     if (!app) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Ensure the user has permission to update the status
//     if (req.user.type === 'employee' && String(app.jobId.postedBy) !== String(req.user._id)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     app.status = status;
//     await app.save();

// const seekerId= app.seekerId._id.toString();
    
//     await createNotification(
//       seekerId,
//       'Status updated',
//       `Status updated for ${app.jobId.title} `,
//       `/employee/seekerApplications`
//     );

   
  

//     res.json(app);
//   } catch (err) {
//     console.log('Error updating application status:', err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'hired'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const app = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('seekerId', '_id')
      .populate('referrerId'); // Added populate referrerId here

    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure the user has permission to update the status
    if (req.user.type === 'employee' && String(app.jobId.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    app.status = status;
    await app.save();

    // Referral count increment logic
    if (
      req.user.currentRole === 'referrer' &&
      status === 'shortlisted' &&
      app.referrerId &&
      String(app.referrerId._id) === String(req.user._id) &&
      !app.referralCounted
    ) {
      // Increment referralBadge.count for the referrer
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'referralBadge.count': 1 }
      });

      // Mark this application as counted
      app.referralCounted = true;
      await app.save();
    }

    const seekerId = app.seekerId._id.toString();

    await createNotification(
      seekerId,
      'Status updated',
      `Status updated for ${app.jobId.title} `,
      `/employee/seekerApplications`
    );

    res.json(app);
  } catch (err) {
    console.log('Error updating application status:', err);
    res.status(500).json({ message: err.message });
  }
};






// GET /api/applications/job/:jobId  (Referrer/HR)
export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    let filter = { jobId };
    if (req.user.type === 'employee') {
      // referrer only sees his referral job
      if (job.type !== 'referral' || String(job.postedBy) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else { // HR
      if (!job.companyId.hrIds.includes(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    }

    const apps = await Application.find(filter)
      .populate('seekerId', 'name email resumeUrl yearsOfExp skills avatarUrl')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







export const downloadApplicationsExcel = async (req, res) => {
  try {
    const { jobId } = req.query;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    // Step 1: Set headers for streaming Excel file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=applications.xlsx'
    );

    // Step 2: Create streaming workbook
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet('Applications');

    // Step 3: Define headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Skills', key: 'skills', width: 30 },
      { header: 'Years of Exp', key: 'yearsOfExp', width: 15 },
      { header: 'Resume', key: 'resumeUrl', width: 30 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'LinkedIn', key: 'linkedinUrl', width: 30 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Company Name', key: 'companyName', width: 25 },
    ];

    // Step 4: Use MongoDB cursor to iterate without loading all documents in memory
    const cursor = Application.find({ jobId })
      .populate('seekerId', 'name email phone skills yearsOfExp resumeUrl location linkedinUrl designation companyId')
      .populate('seekerId.companyId', 'name')
      .cursor();

    for await (const app of cursor) {
      const seeker = app.seekerId || {};
      const company = seeker.companyId || {};

      const row = worksheet.addRow({
        name: seeker.name || '',
        email: seeker.email || '',
        phone: seeker.phone || '',
        skills: (seeker.skills || []).join(', '),
        yearsOfExp: seeker.yearsOfExp ?? '',
        resumeUrl: 'Download', // display text
        location: seeker.location || '',
        linkedinUrl: seeker.linkedinUrl || '',
        designation: seeker.designation || '',
        companyName: company.name || '',
      });

      // Add hyperlink to resume cell using backend download route
      const resumeCell = row.getCell('resumeUrl');
      if (seeker._id) {
        resumeCell.value = {
          text: '📄Download',
          hyperlink: `${process.env.BASE_URL}/api/upload/download-resume/${seeker._id}`,
        };
      }

      row.commit(); // commit row immediately for streaming
    }

    // Step 5: Commit workbook and end response
    await workbook.commit();
    // no need to call res.end() as stream closes automatically after commit

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: 'Failed to generate Excel file', error: error.message });
  }
};

