import mongoose from 'mongoose'


const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    location: String,

    remote: { type: Boolean, default: false },

    salaryRange: { min: Number, max: Number },

    experienceRequired: { min: Number, max: Number },

    skillsRequired: [String],

    department: String,

    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },

    jobLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'lead'],
    },

    benefits: [String],

    tags: [String],

    openings: { type: Number, default: 1 },

    expiryDate: Date,

    isFeatured: { type: Boolean, default: false },

    isReferralOpen: { type: Boolean, default: true },

    status: {
      type: String,
        enum: ['active', 'paused', 'closed'],
      default: 'active',
    },

    externalLink: String,

    applicationCount: { type: Number, default: 0 },

    claimedByCount: { type: Number, default: 0 },

    type: { type: String, enum: ['company', 'referral'], required: true },

    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // For referral copies

    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If referral

    isActive: { type: Boolean, default: true },

    views: { type: Number, default: 0 },

    clicks: { type: Number, default: 0 },

    autoExpire: { type: Boolean, default: true }, // Job will auto-expire if true
expiresAt: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) }

  },
  { timestamps: true }
);


// Compound Index for filtering jobs by company and active status
jobSchema.index({ companyId: 1, isActive: 1 });

// Index to sort/search by createdAt quickly
jobSchema.index({ createdAt: -1 });

// Text index for searching jobs by title and description
jobSchema.index({ title: 'text', description: 'text' });

// Optional: index for location-based filtering
jobSchema.index({ location: 1 });

// Optional: index for expiry cleanup or filtering
jobSchema.index({ expiryDate: 1 });

jobSchema.index({ isActive: 1, expiryDate: 1 });

export default mongoose.model('Job', jobSchema);
