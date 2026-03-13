

import ReferrerProfile from "../models/ReferrerProfile.model.js";
import { createError } from "../middleware/error.middleware.js";

export const getMyReferrerProfile = async (req, res, next) => {
  try {
    const profile = await ReferrerProfile.findOne({ userId: req.user._id });
    if (!profile) return next(createError(404, "Referrer profile not found"));
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const profile = await ReferrerProfile.findOne({ userId: req.user._id });
    if (!profile) return next(createError(404, "Referrer profile not found"));
    profile.isActive = !profile.isActive;
    await profile.save();
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};

export const updatePrivacySettings = async (req, res, next) => {
  try {
    const { showOnLeaderboard, displayAlias, receieveCandidateDetails, candidateEmailOverride } = req.body;
    const profile = await ReferrerProfile.findOne({ userId: req.user._id });
    if (!profile) return next(createError(404, "Referrer profile not found"));

    if (typeof showOnLeaderboard === "boolean") profile.showOnLeaderboard = showOnLeaderboard;

    if (displayAlias !== undefined) {
      profile.displayAlias = displayAlias.trim().slice(0, 40);
    }

    if (typeof receieveCandidateDetails === "boolean") profile.receieveCandidateDetails = receieveCandidateDetails;

    if (candidateEmailOverride !== undefined) {
      const email = candidateEmailOverride.trim().toLowerCase();
      // Basic email validation
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return next(createError(400, "Please enter a valid email address"));
      }
      profile.candidateEmailOverride = email;
    }

    await profile.save();
    res.json({ profile });
  } catch (err) {
    next(err);
  }
};