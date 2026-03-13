import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    aliases: [{ type: String, trim: true, lowercase: true }],
    type: {
      type: String,
      enum: ["company", "hr_firm", "consultancy"],
      default: "company",
    },
    industry: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    logoUrl: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

companySchema.index({ name: "text", aliases: "text" });
// slug index comes from unique:true on the field definition

companySchema.statics.generateSlug = function (name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // spaces → hyphens
    .replace(/[^a-z0-9-]/g, "")    // strip special chars
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .replace(/^-|-$/g, "");         // trim leading/trailing hyphens
};

companySchema.statics.normalize = function (name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(inc|llc|ltd|corp|co|pvt|private|limited|group|holdings|technologies|technology|solutions|services|consulting)\b\.?/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export default mongoose.model("Company", companySchema);