import Application from "../models/Application.model.js";
import Company from "../models/Company.model.js";

// Auto-generate "F. Lastname" style alias from a real name
const makeAlias = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase() + ".";
  const first = parts[0].charAt(0).toUpperCase() + ".";
  const last  = parts[parts.length - 1];
  return `${first} ${last}`;
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const { companyId, period = "month" } = req.query;

    const now = new Date();
    let startDate;
    if (period === "week") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (period === "alltime") {
      startDate = new Date(0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const pipeline = [
      { $match: { assignedReferrerId: { $ne: null }, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id:      "$assignedReferrerId",
          total:    { $sum: 1 },
          referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } },
          pending:  { $sum: { $cond: [{ $in: ["$status", ["APPLIED", "FORWARDED"]] }, 1, 0] } },
        },
      },
      // User lookup
      { $lookup: { from: "users",            localField: "_id", foreignField: "_id",      as: "user" } },
      { $unwind: { path: "$user",    preserveNullAndEmptyArrays: true } },
      // Referrer profile lookup — has showOnLeaderboard + displayAlias
      { $lookup: { from: "referrerprofiles", localField: "_id", foreignField: "userId",   as: "profile" } },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      // Company lookup
      { $lookup: { from: "companies",        localField: "profile.companyId", foreignField: "_id", as: "company" } },
      {
        $addFields: {
          showOnLeaderboard: { $ifNull: ["$profile.showOnLeaderboard", false] },
          realName:          { $ifNull: ["$user.name", ""] },
          displayAlias:      { $ifNull: ["$profile.displayAlias", ""] },
          companyName:       { $ifNull: [{ $arrayElemAt: ["$company.name", 0] }, "Independent"] },
          companyIdRef:      "$profile.companyId",
          referralRate: {
            $cond: [
              { $gt: ["$total", 0] },
              { $round: [{ $multiply: [{ $divide: ["$referred", "$total"] }, 100] }, 0] },
              0,
            ],
          },
        },
      },
      { $project: { user: 0, profile: 0, company: 0 } },
      { $sort: { referred: -1, total: -1 } },
      { $limit: 50 },
    ];

    let raw = await Application.aggregate(pipeline);

    // Apply privacy — mask name unless opted in
    const leaderboard = raw.map((r) => {
      const displayName = r.showOnLeaderboard
        ? r.realName  // show real name
        : (r.displayAlias || makeAlias(r.realName)); // alias or auto-generated

      return {
        _id:          r._id,
        name:         displayName,
        isAnonymous:  !r.showOnLeaderboard,
        companyName:  r.companyName,
        companyIdRef: r.companyIdRef,
        total:        r.total,
        referred:     r.referred,
        pending:      r.pending,
        referralRate: r.referralRate,
      };
    });

    // Filter by company if requested
    const filtered = companyId
      ? leaderboard.filter((r) => r.companyIdRef?.toString() === companyId)
      : leaderboard;

    const companies = await Company.find({ type: "company" })
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    res.json({ leaderboard: filtered, companies, period, startDate });
  } catch (err) {
    next(err);
  }
};
