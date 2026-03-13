import mongoose from "mongoose";
import crypto from "crypto";

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    token:  { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

emailVerificationSchema.index({ token: 1 });
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

emailVerificationSchema.statics.generate = async function (userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await this.findOneAndUpdate({ userId }, { token, expiresAt }, { upsert: true });
  return token;
};

export default mongoose.model("EmailVerification", emailVerificationSchema);
