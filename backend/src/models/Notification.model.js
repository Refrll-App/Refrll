import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type:     { type: String, required: true }, // APPLICATION_RECEIVED | REFERRED | DECLINED | FORWARDED | NEW_REQUEST
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    link:     { type: String, default: "/dashboard" },
    read:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
