import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name:     { type: String, unique: true, required: true },
    website:  String,
    logoUrl:  String,
    about:    String,
    hrIds:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalJobs:      { type: Number, default: 0 },
    totalReferrals: { type: Number, default: 0 },
    size: { type: String, enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'] },
    industry: String,
    location: String,


  },
  { timestamps: true }
);





export default mongoose.model('Company', companySchema);