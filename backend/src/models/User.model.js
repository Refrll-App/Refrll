import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, select: false },
    currentCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    skills:           [{ type: String, trim: true }],
    experience:       { type: Number, default: 0 },
    bio:              { type: String, default: "" },
    linkedIn:         { type: String, default: "" },
    resumeUrl:        { type: String, default: "" },
    roleMode:         { type: String, enum: ["seeker", "referrer"], default: "seeker" },
    isAdmin:          { type: Boolean, default: false },
    isEmailVerified:  { type: Boolean, default: false },
    referralCap:      { type: Number, default: 15 }, // max pending applications for referrers
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("currentCompany").get(function () {
  if (this.currentCompanyId && typeof this.currentCompanyId === "object") {
    return this.currentCompanyId.name || null;
  }
  return null;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// email index comes from unique:true on the field definition — no need to repeat
userSchema.index({ roleMode: 1 });
userSchema.index({ currentCompanyId: 1 });

export default mongoose.model("User", userSchema);