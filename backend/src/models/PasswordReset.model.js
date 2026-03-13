import mongoose from "mongoose";
import crypto from "crypto";

const passwordResetSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// token index comes from unique:true on the field definition

passwordResetSchema.statics.generate = async function (userId) {
  await this.deleteMany({ userId });
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await this.create({ userId, token, expiresAt });
  return token;
};

export default mongoose.model("PasswordReset", passwordResetSchema);