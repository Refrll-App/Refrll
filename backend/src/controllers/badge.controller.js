import User from "../models/User.model.js";
import Application from "../models/Application.model.js";
import ReferrerProfile from "../models/ReferrerProfile.model.js";

// Returns badge data as JSON (used by the frontend badge page)
export const getBadgeData = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await ReferrerProfile.findOne({ userId })
      .populate("companyId", "name")
      .lean();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // All-time stats
    const [allTime, thisMonth] = await Promise.all([
      Application.aggregate([
        { $match: { assignedReferrerId: user._id || require("mongoose").Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            total:    { $sum: 1 },
            referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } },
          },
        },
      ]),
      Application.aggregate([
        {
          $match: {
            assignedReferrerId: user._id,
            createdAt: { $gte: monthStart },
          },
        },
        {
          $group: {
            _id: null,
            total:    { $sum: 1 },
            referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } },
          },
        },
      ]),
    ]);

    // Compute rank this month
    const leaderboard = await Application.aggregate([
      { $match: { assignedReferrerId: { $ne: null }, createdAt: { $gte: monthStart } } },
      { $group: { _id: "$assignedReferrerId", referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } } } },
      { $sort: { referred: -1 } },
    ]);

    const rankIndex = leaderboard.findIndex((r) => r._id.toString() === userId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : null;

    const allTimeData  = allTime[0]  || { total: 0, referred: 0 };
    const monthData    = thisMonth[0] || { total: 0, referred: 0 };
    const referralRate = allTimeData.total > 0
      ? Math.round((allTimeData.referred / allTimeData.total) * 100)
      : 0;

    res.json({
      name: user.name,
      companyName: profile?.companyId?.name || "Independent",
      allTimeReferrals: allTimeData.referred,
      monthReferrals: monthData.referred,
      referralRate,
      rank,
    });
  } catch (err) {
    next(err);
  }
};

// Serves an HTML page with Open Graph tags — LinkedIn scrapes this
export const getBadgePage = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const CLIENT_URL = process.env.CLIENT_URL || "https://refrll.com";

    const user = await User.findById(userId).select("name").lean();
    if (!user) return res.status(404).send("Not found");

    const profile = await ReferrerProfile.findOne({ userId })
      .populate("companyId", "name")
      .lean();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allTimeAgg, monthAgg, leaderboard] = await Promise.all([
      Application.aggregate([
        { $match: { assignedReferrerId: user._id } },
        { $group: { _id: null, total: { $sum: 1 }, referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } } } },
      ]),
      Application.aggregate([
        { $match: { assignedReferrerId: user._id, createdAt: { $gte: monthStart } } },
        { $group: { _id: null, referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } } } },
      ]),
      Application.aggregate([
        { $match: { assignedReferrerId: { $ne: null }, createdAt: { $gte: monthStart } } },
        { $group: { _id: "$assignedReferrerId", referred: { $sum: { $cond: [{ $eq: ["$status", "REFERRED"] }, 1, 0] } } } },
        { $sort: { referred: -1 } },
      ]),
    ]);

    const allTime = allTimeAgg[0] || { total: 0, referred: 0 };
    const month   = monthAgg[0]   || { referred: 0 };
    const rankIdx = leaderboard.findIndex((r) => r._id.toString() === userId);
    const rank    = rankIdx >= 0 ? rankIdx + 1 : null;
    const rate    = allTime.total > 0 ? Math.round((allTime.referred / allTime.total) * 100) : 0;
    const company = profile?.companyId?.name || "Independent";

    const makeAlias = (n = "") => {
      const p = n.trim().split(/\s+/);
      return p.length === 1 ? p[0].charAt(0).toUpperCase() + "." : p[0].charAt(0).toUpperCase() + ". " + p[p.length - 1];
    };
    const displayName = profile?.showOnLeaderboard
      ? user.name
      : (profile?.displayAlias || makeAlias(user.name));
    const title       = `${displayName} — Refrll Top Referrer`;
    const description = rank
      ? `Ranked #${rank} on Refrll this month · ${allTime.referred} referrals · ${rate}% success rate · Helping professionals land jobs at ${company}`
      : `${allTime.referred} referrals · ${rate}% success rate · Helping professionals land jobs at ${company} via Refrll`;

    const badgeUrl   = `${CLIENT_URL}/badge/${userId}`;
    const imageUrl   = `${CLIENT_URL}/logo.png`; // replace with a generated OG image if you add that later
    const profileUrl = `${CLIENT_URL}/leaderboard`;

    // Full HTML page with OG + Twitter Card meta tags
    // LinkedIn will scrape this when you share the URL
    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <!-- Open Graph (LinkedIn, Facebook, WhatsApp) -->
  <meta property="og:type"        content="profile" />
  <meta property="og:url"         content="${badgeUrl}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image"       content="${imageUrl}" />
  <meta property="og:site_name"   content="Refrll" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image"       content="${imageUrl}" />

  <!-- Redirect to leaderboard after 2s -->
  <meta http-equiv="refresh" content="2;url=${profileUrl}" />

  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:sans-serif;background:#faf9ff;color:#0f0e17;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .card{background:#fff;border:1px solid #e4e0f5;border-radius:20px;padding:40px;text-align:center;max-width:400px;width:90%}
    .logo{height:36px;margin-bottom:24px}
    h1{font-size:20px;font-weight:700;margin-bottom:8px}
    p{font-size:14px;color:#4a4860;line-height:1.6}
    .stats{display:flex;justify-content:center;gap:32px;margin:24px 0}
    .stat p:first-child{font-size:28px;font-weight:700;color:#6c47ff}
    .stat p:last-child{font-size:12px;color:#a8a4c0;margin-top:2px}
    .redirect{font-size:12px;color:#a8a4c0;margin-top:16px}
  </style>
</head>
<body>
  <div class="card">
    <img src="${imageUrl}" alt="Refrll" class="logo" />
    <h1>${displayName}</h1>
    <p>${company}${rank ? ` · #${rank} this month` : ""}</p>
    <div class="stats">
      <div class="stat"><p>${allTime.referred}</p><p>Referrals</p></div>
      <div class="stat"><p>${rate}%</p><p>Success Rate</p></div>
      ${rank ? `<div class="stat"><p>#${rank}</p><p>Rank</p></div>` : ""}
    </div>
    <p class="redirect">Redirecting to leaderboard...</p>
  </div>
</body>
</html>`);
  } catch (err) {
    next(err);
  }
};
