import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired'],
      default: 'applied'
    },
     referralCounted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// prevent duplicate applications
applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });
applicationSchema.index({ seekerId: 1 });     // To fetch applications for a seeker
applicationSchema.index({ referrerId: 1 });   // To fetch applications for a referrer
applicationSchema.index({ jobId: 1 });        // To fetch all applications for a job
applicationSchema.index({ status: 1 });       // To filter by status (e.g., 'shortlisted')
applicationSchema.index({ jobId: 1, status: 1 }); // For grouped filtering

export default mongoose.model('Application', applicationSchema);