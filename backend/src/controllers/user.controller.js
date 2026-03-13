
import { uploadToCloudinary } from "../config/cloudinary.js";
import User from "../models/User.model.js";
import ReferrerProfile from "../models/ReferrerProfile.model.js";
import Company from "../models/Company.model.js";
import { createError } from "../middleware/error.middleware.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("currentCompanyId");
    res.json({ user });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentCompanyId, skills, experience, bio, linkedIn } = req.body;
    const updateData = {};

    if (name !== undefined)       updateData.name = name;
    if (skills !== undefined)     updateData.skills = Array.isArray(skills) ? skills : [skills];
    if (experience !== undefined) updateData.experience = Number(experience);
    if (bio !== undefined)        updateData.bio = bio;
    if (linkedIn !== undefined)   updateData.linkedIn = linkedIn;

    if (currentCompanyId !== undefined) {
      if (currentCompanyId) {
        const company = await Company.findById(currentCompanyId);
        if (!company) return next(createError(404, "Company not found"));
        updateData.currentCompanyId = currentCompanyId;
      } else {
        updateData.currentCompanyId = null;
      }
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.user._id);
      // Store clean URL — fl_attachment with filename added dynamically on the frontend
      updateData.resumeUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).populate("currentCompanyId");

    if (currentCompanyId !== undefined) {
      const referrerProfile = await ReferrerProfile.findOne({ userId: req.user._id });
      if (referrerProfile) {
        if (currentCompanyId) {
          referrerProfile.companyId = currentCompanyId;
          await referrerProfile.save();
        } else {
          await ReferrerProfile.deleteOne({ userId: req.user._id });
          await User.findByIdAndUpdate(req.user._id, { roleMode: "seeker" });
          user.roleMode = "seeker";
        }
      }
    }

    res.json({ user });
  } catch (err) { next(err); }
};

export const switchRoleMode = async (req, res, next) => {
  try {
    const { roleMode } = req.body;
    if (!["seeker", "referrer"].includes(roleMode)) {
      return next(createError(400, "Invalid role mode"));
    }

    const user = await User.findById(req.user._id).populate("currentCompanyId");

    if (roleMode === "referrer") {
      if (!user.currentCompanyId) {
        return next(createError(400, "Please add your current company before switching to referrer mode"));
      }
      const referrerProfile = await ReferrerProfile.findOne({ userId: user._id });
      if (!referrerProfile) {
        await ReferrerProfile.create({
          userId:    user._id,
          companyId: user.currentCompanyId._id,
          orgType:   "employee",
          isActive:  true,
        });
      }
    }

    user.roleMode = roleMode;
    await user.save();

    const populated = await User.findById(user._id).populate("currentCompanyId");
    res.json({ user: populated });
  } catch (err) { next(err); }
};