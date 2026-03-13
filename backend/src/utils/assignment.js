import ReferrerProfile from "../models/ReferrerProfile.model.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";

const DEFAULT_CAP = 15;

export const assignReferrer = async (companyId, excludeIds = []) => {
  const referrers = await ReferrerProfile.find({
    $or: [
      { companyId, orgType: "employee" },
      { clientCompanyIds: companyId, orgType: { $in: ["hr_firm", "consultancy"] } },
    ],
    isActive: true,
    userId: { $nin: excludeIds },
  }).lean();

  if (!referrers.length) return null;

  const referrerIds = referrers.map((r) => r.userId);

  // Get pending counts and user caps in parallel
  const [counts, users] = await Promise.all([
    Application.aggregate([
      { $match: { assignedReferrerId: { $in: referrerIds }, status: { $in: ["APPLIED", "FORWARDED"] } } },
      { $group: { _id: "$assignedReferrerId", count: { $sum: 1 } } },
    ]),
    User.find({ _id: { $in: referrerIds } }).select("referralCap").lean(),
  ]);

  const countMap = {};
  counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

  const capMap = {};
  users.forEach((u) => { capMap[u._id.toString()] = u.referralCap ?? DEFAULT_CAP; });

  // Filter out referrers at cap, then sort by least loaded
  const available = referrers.filter((r) => {
    const id = r.userId.toString();
    return (countMap[id] || 0) < (capMap[id] || DEFAULT_CAP);
  });

  if (!available.length) return null;

  available.sort((a, b) => {
    return (countMap[a.userId.toString()] || 0) - (countMap[b.userId.toString()] || 0);
  });

  return available[0].userId;
};
