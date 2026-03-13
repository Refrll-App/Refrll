


import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    seekerId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId:          { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    jobId:              { type: String, default: "", trim: true },
    jobTitle:           { type: String, default: "", trim: true },
    jobDescription:     { type: String, default: "", trim: true },
    noticePeriod:       { type: String, default: "", trim: true }, // e.g. "Immediate", "30 days", "60 days"
    sendDetailsToReferrer: { type: Boolean, default: false }, // referrer opted in to receive candidate email
    message:            { type: String, required: true },
    resumeUrl:          { type: String, required: true },
    assignedReferrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["APPLIED", "REFERRED", "NOT_SHORTLISTED", "NO_REFERRER_AVAILABLE", "FORWARDED"],
      default: "APPLIED",
    },
    rejectionReason:  { type: String, default: "" },
    forwardedCount:   { type: Number, default: 0 },
    lastActionAt:     { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

applicationSchema.index({ seekerId: 1 });
applicationSchema.index({ assignedReferrerId: 1, status: 1 });
applicationSchema.index({ companyId: 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model("Application", applicationSchema);