// import mongoose from "mongoose";

// const referrerProfileSchema = new mongoose.Schema(
//   {
//     userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//     companyId:        { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
//     clientCompanyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
//     orgType:          { type: String, enum: ["employee", "hr_firm", "consultancy"], default: "employee" },
//     isActive:         { type: Boolean, default: true },

//     // Privacy settings
//     showOnLeaderboard: { type: Boolean, default: false },   // opt-in — hidden by default
//     displayAlias:      { type: String, default: "" },       // custom alias e.g. "Priya M." — if empty, auto-generate
//   },
//   {
//     timestamps: true,
//     toJSON:   { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// referrerProfileSchema.index({ companyId: 1, isActive: 1 });
// referrerProfileSchema.index({ clientCompanyIds: 1, isActive: 1 });

// export default mongoose.model("ReferrerProfile", referrerProfileSchema);



import mongoose from "mongoose";

const referrerProfileSchema = new mongoose.Schema(
  {
    userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId:        { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    clientCompanyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    orgType:          { type: String, enum: ["employee", "hr_firm", "consultancy"], default: "employee" },
    isActive:         { type: Boolean, default: true },

    // Candidate email preferences
    receieveCandidateDetails: { type: Boolean, default: true },   // receive candidate info email when referring
    candidateEmailOverride:   { type: String, default: "" },       // if set, send to this instead of account email

    // Privacy settings
    showOnLeaderboard: { type: Boolean, default: false },   // opt-in — hidden by default
    displayAlias:      { type: String, default: "" },       // custom alias e.g. "Priya M." — if empty, auto-generate
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

referrerProfileSchema.index({ companyId: 1, isActive: 1 });
referrerProfileSchema.index({ clientCompanyIds: 1, isActive: 1 });

export default mongoose.model("ReferrerProfile", referrerProfileSchema);