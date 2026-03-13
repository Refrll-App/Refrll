

import { cached } from "../config/redis.js";
import User from "../models/User.model.js";
import Application from "../models/Application.model.js";

export const getStats = async (req, res, next) => {
  try {
    const result = await cached("admin:stats", 60, async () => {
      const [
        totalUsers,
        totalSeekers,
        totalReferrers,
        totalApps,
        statusCounts,
        requestsPerCompany,
        requestsPerReferrer,
        dailyRequests,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ roleMode: "seeker" }),
        User.countDocuments({ roleMode: "referrer" }),
        Application.countDocuments(),

        Application.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),

        Application.aggregate([
          {
            $group: {
              _id: "$companyId",
              total: { $sum: 1 },
              referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } },
              pending: { $sum: { $cond: [{ $in: ["$status", ["APPLIED", "FORWARDED"]] }, 1, 0] } },
            },
          },
          { $lookup: { from: "companies", localField: "_id", foreignField: "_id", as: "co" } },
          { $addFields: { name: { $ifNull: [{ $arrayElemAt: ["$co.name", 0] }, "Unknown"] } } },
          { $project: { co: 0 } },
          { $sort: { total: -1 } },
          { $limit: 10 },
        ]),

        Application.aggregate([
          { $match: { assignedReferrerId: { $ne: null } } },
          {
            $group: {
              _id: "$assignedReferrerId",
              total: { $sum: 1 },
              referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } },
              declined: { $sum: { $cond: [{ $eq: ["$status", "NOT_SHORTLISTED"] }, 1, 0] } },
            },
          },
          { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "u" } },
          // Extract user fields including currentCompanyId before second lookup
          {
            $addFields: {
              name:             { $ifNull: [{ $arrayElemAt: ["$u.name", 0] }, "Unknown"] },
              email:            { $ifNull: [{ $arrayElemAt: ["$u.email", 0] }, ""] },
              currentCompanyId: { $arrayElemAt: ["$u.currentCompanyId", 0] },
              referralRate: {
                $cond: [
                  { $gt: ["$total", 0] },
                  { $round: [{ $multiply: [{ $divide: ["$referred", "$total"] }, 100] }, 0] },
                  0,
                ],
              },
            },
          },
          // Now lookup company using the extracted currentCompanyId field
          { $lookup: { from: "companies", localField: "currentCompanyId", foreignField: "_id", as: "co" } },
          {
            $addFields: {
              companyName: { $ifNull: [{ $arrayElemAt: ["$co.name", 0] }, "—"] },
            },
          },
          { $project: { u: 0, co: 0, currentCompanyId: 0 } },
          { $sort: { total: -1 } },
          { $limit: 10 },
        ]),

        Application.aggregate([
          { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
      ]);

      const statusMap = {};
      statusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

      return {
        totalUsers,
        totalSeekers,
        totalReferrers,
        totalApps,
        statusCounts,
        funnel: {
          created: totalApps,
          assigned: totalApps - (statusMap["NO_REFERRER_AVAILABLE"] || 0),
          referred: statusMap["REFERRED"] || 0,
          notShortlisted: statusMap["NOT_SHORTLISTED"] || 0,
          pending: (statusMap["APPLIED"] || 0) + (statusMap["FORWARDED"] || 0),
        },
        requestsPerCompany,
        requestsPerReferrer,
        dailyRequests,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const filter = {};
    if (req.query.role)   filter.roleMode = req.query.role;
    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { name:  { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("currentCompanyId", "name").lean(),
      User.countDocuments(filter),
    ]);

    res.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 20;
    const skip   = (page - 1) * limit;
    const filter = req.query.status ? { status: req.query.status } : {};

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate("seekerId", "name email resumeUrl")
        .populate("assignedReferrerId", "name email")
        .populate("companyId", "name"),
      Application.countDocuments(filter),
    ]);

    res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};