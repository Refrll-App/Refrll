

import Application from "../models/Application.model.js";
import ReferrerProfile from "../models/ReferrerProfile.model.js";
import User from "../models/User.model.js";
import Company from "../models/Company.model.js";
import { assignReferrer } from "../utils/assignment.js";
import { createError } from "../middleware/error.middleware.js";
import { createNotification } from "./notification.controller.js";
import { sendEmail, emails } from "../config/email.js";


const DASHBOARD_URL = process.env.CLIENT_URL + "/dashboard";

export const createApplication = async (req, res, next) => {
  try {
    const { companyId, jobId, jobTitle, jobDescription, noticePeriod, message, sendDetailsToReferrer } = req.body;
    const seeker = await User.findById(req.user._id);

    if (!seeker.resumeUrl) {
      return next(createError(400, "Please upload your resume before applying"));
    }

    const company = await Company.findById(companyId);
    if (!company) return next(createError(404, "Company not found"));

    // Duplicate check — only block if same company + same jobId (when provided)
    // If no jobId, allow re-application (different roles at same company)
    if (jobId && jobId.trim()) {
      const existing = await Application.findOne({
        seekerId: req.user._id,
        companyId,
        jobId: jobId.trim(),
        status: { $nin: ["NOT_SHORTLISTED"] },
      });
      if (existing) return next(createError(409, "You have already applied for this job ID at this company"));
    }

    const assignedReferrerId = await assignReferrer(companyId);

    const application = await Application.create({
      seekerId: req.user._id,
      companyId,
      jobId:       jobId       || "",
      jobTitle:    jobTitle    || "",
      jobDescription: jobDescription || "",
      noticePeriod:   noticePeriod   || "",
      message,
      resumeUrl: seeker.resumeUrl,
      sendDetailsToReferrer: sendDetailsToReferrer !== false, // default true
      assignedReferrerId,
      status: assignedReferrerId ? "APPLIED" : "NO_REFERRER_AVAILABLE",
    });

    const populated = await Application.findById(application._id)
      .populate("companyId", "name slug type logoUrl")
      .populate("assignedReferrerId", "name email");

    // Async notifications — don't block the response
    if (assignedReferrerId) {
      const referrer = populated.assignedReferrerId;
      Promise.all([
        // Notify seeker
        createNotification({
          userId: seeker._id,
          type: "APPLICATION_RECEIVED",
          title: "Application submitted",
          message: `Your referral request for ${company.name} is being reviewed.`,
        }),
        sendEmail({
          to: seeker.email,
          subject: `Application submitted — ${company.name}`,
          html: emails.applicationReceived({ seekerName: seeker.name, companyName: company.name, jobTitle: jobTitle || jobId || 'Not specified' }),
        }),
        // Notify referrer
        createNotification({
          userId: assignedReferrerId,
          type: "NEW_REQUEST",
          title: "New referral request",
          message: `${seeker.name} is requesting a referral at ${company.name}.`,
        }),
        // Referrer email removed — in-app bell notification is sufficient
      ]).catch((err) => console.error("Notification error:", err.message));
    }


    res.status(201).json({ application: populated });
  } catch (err) {
    next(err);
  }
};

export const getSeekerApplications = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ seekerId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("companyId", "name slug type logoUrl isVerified")
        .populate("assignedReferrerId", "name email"),
      Application.countDocuments({ seekerId: req.user._id }),
    ]);

    res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

export const getReferrerApplications = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ assignedReferrerId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("companyId", "name slug type logoUrl isVerified")
        .populate("seekerId", "name email skills experience bio resumeUrl linkedIn"),
      Application.countDocuments({ assignedReferrerId: req.user._id }),
    ]);

    res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const { id } = req.params;

    if (!["REFERRED", "NOT_SHORTLISTED"].includes(status)) {
      return next(createError(400, "Invalid status"));
    }

    const application = await Application.findOne({ _id: id, assignedReferrerId: req.user._id })
      .populate("seekerId", "name email resumeUrl skills experience bio linkedIn")
      .populate("companyId", "name")
      .populate("assignedReferrerId", "name email");

    if (!application) return next(createError(404, "Application not found"));

    application.status = status;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    application.lastActionAt = new Date();
    await application.save();

    const seeker = application.seekerId;
    const company = application.companyId;
    const referrer = application.assignedReferrerId;

    if (status === "REFERRED") {
      Promise.all([
        createNotification({
          userId: seeker._id,
          type: "REFERRED",
          title: "You've been referred! 🎉",
          message: `${referrer.name} referred you at ${company.name}.`,
          link: "/my-applications",
        }),
        // Email seeker — confirmation
        sendEmail({
          to: seeker.email,
          subject: `You've been referred at ${company.name}! 🎉`,
          html: emails.applicationReferred({
            seekerName: seeker.name,
            companyName: company.name,
            jobTitle: application.jobTitle || application.jobId || "",
            referrerName: referrer.name,
            referrerNote: rejectionReason || "",
          }),
        }),
        // Email referrer — based on referrer's own preference setting
        (async () => {
          const referrerProfile = await ReferrerProfile.findOne({ userId: referrer._id }).lean();
          const wantsEmail = referrerProfile?.receieveCandidateDetails !== false; // default true
          const toEmail    = referrerProfile?.candidateEmailOverride || referrer.email;
          if (!wantsEmail || !toEmail) return;
          return sendEmail({
            to: toEmail,
            subject: `Candidate details — ${seeker.name} for ${company.name}`,
            html: emails.candidateDetailsForReferrer({
              referrerName: referrer.name,
              seekerName: seeker.name,
              seekerEmail: seeker.email,
              companyName: company.name,
              jobTitle: application.jobTitle || application.jobId || "Not specified",
              jobUrl: application.jobUrl || "",
              noticePeriod: application.noticePeriod || "",
              skills: seeker.skills || [],
              experience: seeker.experience ?? null,
              bio: seeker.bio || "",
              linkedIn: seeker.linkedIn || "",
              message: application.message,
              resumeUrl: seeker.resumeUrl || "",
            }),
            attachments: seeker.resumeUrl ? [{ url: seeker.resumeUrl, filename: `${seeker.name.replace(/\s+/g, "_")}_Resume.pdf` }] : [],
          });
        })(),
      ]).catch((err) => console.error("Notification error:", err.message));
    } else {
      Promise.all([
        createNotification({
          userId: seeker._id,
          type: "DECLINED",
          title: "Application update",
          message: `Your referral request for ${company.name} was not accepted.`,
        }),
        sendEmail({
          to: seeker.email,
          subject: `Application update — ${company.name}`,
          html: emails.applicationDeclined({ seekerName: seeker.name, companyName: company.name, reason: rejectionReason }),
        }),
      ]).catch((err) => console.error("Notification error:", err.message));
    }

  

    res.json({ application });
  } catch (err) {
    next(err);
  }
};

