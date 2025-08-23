// // server/src/models/User.js
import mongoose from 'mongoose';

const badgeEnum = ['bronze', 'silver', 'gold', 'platinum'];

const userSchema = new mongoose.Schema(
  {
    email:       { type: String, unique: true, lowercase: true, required: true },

    password:    { type: String, required: function () {
    return this.provider !== 'google'; // ✅ Only required for local accounts
  }},

   provider: {
   type: String,
   enum: ['local', 'google'],
   default: 'local'
}, 

    type: { type: String, enum: ['employee', 'hr'], required: true },

    designation:String,

    currentRole: {
      type: String,
      enum: ['seeker', 'referrer' , 'hr'],
      default: 'seeker',
    },

    roles:{ type: [String], enum: ['seeker', 'referrer', 'hr'], required: true },

    name:        { type: String, required: true },

    avatarUrl:   String,

    resumeUrl:   String, 

    phone:       String,

    linkedinUrl: String,

    githubUrl:   String,

    yearsOfExp:  { type: Number, min: 0 },

    skills:      [String], 

    location:    { type: String },

    referralBadge: {
      type:      { type: String, enum: badgeEnum, default: 'bronze' },
      count:     { type: Number, default: 0 } 
    },

  resetPasswordToken: { type: String },

  resetPasswordExpires: { type: Date },

   website:String,

    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },

    isVerified: {
  type: Boolean,
  default: false,
},
companyEmail: {
  type: String,
},
verificationToken: {
  type: String,
},
verificationTokenExpires: {
  type: Date,
},


  },

  


  { timestamps: true }
);


// At bottom of your schema file
userSchema.index({ 'referralBadge.type': 1 });
userSchema.index({ type: 1, currentRole: 1 });
userSchema.index({ yearsOfExp: 1 });



// 🔐 Role Consistency Check
userSchema.pre('save', function (next) {
  if (this.type === 'employee') {
    const validEmployeeRoles = ['seeker', 'referrer'];
    if (!this.roles.every(r => validEmployeeRoles.includes(r))) {
      return next(new Error('Employee roles must be seeker and/or referrer'));
    }
    if (!this.roles.includes(this.currentRole)) {
      this.currentRole = this.roles[0]; // fallback to first valid
    }
  }

  if (this.type === 'hr') {
    if (this.roles.length !== 1 || this.roles[0] !== 'hr') {
      return next(new Error('HR role must be ["hr"]'));
    }
    this.currentRole = 'hr';
  }

  next();
});




export default mongoose.model('User', userSchema);


