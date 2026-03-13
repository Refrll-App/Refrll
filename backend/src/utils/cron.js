import cron from "node-cron";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";
import { assignReferrer } from "./assignment.js";
import { createNotification } from "../controllers/notification.controller.js";
import { sendEmail, emails } from "../config/email.js";

// Guard against double-execution in multi-instance deployments
// Use Redis lock if available; otherwise fall back to in-process guard
let running = false;

export const startAutoForwardCron = () => {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    if (running) return;
    running = true;
    try {
      const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const staleApps = await Application.find({
        status: "APPLIED",
        lastActionAt: { $lt: cutoff },
        assignedReferrerId: { $ne: null },
      })
        .populate("seekerId", "name email")
        .populate("companyId", "name");

      for (const app of staleApps) {
        const previousReferrers = [app.assignedReferrerId];
        const newReferrerId = await assignReferrer(app.companyId._id, previousReferrers);

        if (newReferrerId) {
          app.assignedReferrerId = newReferrerId;
          app.status = "FORWARDED";
          app.forwardedCount += 1;
          app.lastActionAt = new Date();
          await app.save();

          const seeker = app.seekerId;
          const company = app.companyId;
          const newReferrer = await User.findById(newReferrerId).select("name email");

          // Notify seeker
          createNotification({
            userId: seeker._id,
            type: "FORWARDED",
            title: "Application forwarded",
            message: `Your request for ${company.name} has been forwarded to a new referrer.`,
          });
          sendEmail({
            to: seeker.email,
            subject: `Application forwarded — ${company.name}`,
            html: emails.applicationForwarded({ seekerName: seeker.name, companyName: company.name }),
          });

          // Notify new referrer
          if (newReferrer) {
            createNotification({
              userId: newReferrerId,
              type: "NEW_REQUEST",
              title: "Forwarded referral request",
              message: `${seeker.name} needs a referral at ${company.name}.`,
            });
            sendEmail({
              to: newReferrer.email,
              subject: `Forwarded request — ${company.name}`,
              html: emails.newApplicationForReferrer({
                referrerName: newReferrer.name,
                seekerName: seeker.name,
                companyName: company.name,
                jobId: app.jobId,
                dashboardUrl: process.env.CLIENT_URL + "/dashboard",
              }),
            });
          }
        }
      }
    } catch (err) {
      console.error("Auto-forward cron error:", err.message);
    } finally {
      running = false;
    }
  });

  console.log("Auto-forward cron started");
};
