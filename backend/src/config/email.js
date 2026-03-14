// import nodemailer from "nodemailer";

// let transporter = null;

// const getTransporter = () => {
//   if (!transporter) {
//     transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,       // refrllteam@gmail.com
//         pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password from Google
//       },
//     });
//   }
//   return transporter;
// };





// const FROM = `"Refrll" <${process.env.GMAIL_USER || "refrllteam@gmail.com"}>`;

// export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
//   if (!process.env.GMAIL_APP_PASSWORD) {
//     console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`);
//     return;
//   }
//   try {
//     // Resolve URL attachments — fetch the file and pass as buffer
//     const resolvedAttachments = await Promise.all(
//       attachments.map(async ({ url, filename }) => {
//         try {
//           const res = await fetch(url.split("?")[0]); // strip cache-buster
//           if (!res.ok) throw new Error(`Failed to fetch attachment: ${url}`);
//           const buffer = Buffer.from(await res.arrayBuffer());
//           return { filename, content: buffer };
//         } catch (err) {
//           console.error("Attachment fetch failed:", err.message);
//           return null;
//         }
//       })
//     );

//     await getTransporter().sendMail({
//       from: FROM,
//       to,
//       subject,
//       html,
//       attachments: resolvedAttachments.filter(Boolean),
//     });
//   } catch (err) {
//     console.error("Email send failed:", err.message);
//   }
// };

// // ── Base template ─────────────────────────────────────────────────────────────
// const base = (content) => `
// <!DOCTYPE html><html><head><meta charset="utf-8">
// <style>
//   body{font-family:'DM Sans',Arial,sans-serif;background:#faf9ff;margin:0;padding:0;color:#0f0e17}
//   .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e0f5}
//   .header{background:linear-gradient(135deg,#6c47ff,#8b6dff);padding:32px;text-align:center}
//   .header h1{color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px}
//   .header p{color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px}
//   .body{padding:32px}
//   .btn{display:inline-block;background:#6c47ff;color:#fff!important;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px;margin:20px 0}
//   .info-box{background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0}
//   .footer{text-align:center;padding:20px;font-size:12px;color:#9ca3af;border-top:1px solid #f0eeff}
//   p{font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px}
// </style>
// </head><body>
// <div class="wrap">
//   <div class="header"><h1>Refrll</h1><p>Your referral network</p></div>
//   <div class="body">${content}</div>
//   <div class="footer">© ${new Date().getFullYear()} Refrll · <a href="https://refrll.com" style="color:#6c47ff">refrll.com</a><br>You're receiving this because you have an account on Refrll.</div>
// </div>
// </body></html>`;

// // ── Templates ─────────────────────────────────────────────────────────────────
// export const emails = {

//   verifyEmail: ({ name, verifyUrl }) => base(`
//     <p>Hi <strong>${name}</strong>,</p>
//     <p>Thanks for joining Refrll! Please verify your email address to activate your account.</p>
//     <div style="text-align:center"><a href="${verifyUrl}" class="btn">Verify Email Address</a></div>
//     <p style="font-size:13px;color:#9ca3af;text-align:center">This link expires in 24 hours. If you didn't create a Refrll account, you can safely ignore this email.</p>
//   `),

//   forgotPassword: ({ name, resetUrl }) => base(`
//     <p>Hi <strong>${name}</strong>,</p>
//     <p>We received a request to reset your Refrll password. Click the button below to choose a new password.</p>
//     <div style="text-align:center"><a href="${resetUrl}" class="btn">Reset My Password</a></div>
//     <p style="font-size:13px;color:#9ca3af;text-align:center">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
//   `),

//   applicationReceived: ({ seekerName, companyName, jobTitle }) => base(`
//     <p>Hi <strong>${seekerName}</strong>,</p>
//     <p>Your referral request has been received and is being reviewed.</p>
//     <div class="info-box">
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Status</span><span style="color:#0f0e17;font-weight:600;text-align:right">Under Review</span></div>
//     </div>
//     <p>We'll email you as soon as your referrer takes action — usually within 48 hours.</p>
//   `),

//   applicationReferred: ({ seekerName, companyName, jobTitle, referrerNote }) => base(`
//     <p>Hi <strong>${seekerName}</strong>,</p>
//     <p>🎉 Great news! You've been referred for a role at <strong>${companyName}</strong>.</p>
//     <div class="info-box">
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Status</span><span style="color:#10b981;font-weight:600">✓ Referred</span></div>
//     </div>
//     ${referrerNote ? `<div class="info-box"><p style="margin:0;font-size:14px;color:#374151"><strong>Note from your referrer:</strong><br>${referrerNote}</p></div>` : ""}
//     <p>The referral has been submitted internally. The hiring team will reach out directly if your profile is shortlisted. Best of luck! 🚀</p>
//   `),

//   applicationDeclined: ({ seekerName, companyName, jobTitle, reason }) => base(`
//     <p>Hi <strong>${seekerName}</strong>,</p>
//     <p>Your referral request for <strong>${companyName}</strong> was reviewed and the referrer was unable to proceed at this time.</p>
//     <div class="info-box">
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
//     </div>
//     ${reason ? `<div class="info-box"><p style="margin:0;font-size:14px;color:#374151"><strong>Feedback:</strong><br>${reason}</p></div>` : ""}
//     <p>Don't be discouraged — you can apply to other companies on Refrll. Each referrer has different criteria.</p>
//   `),

//   candidateDetailsForReferrer: ({ referrerName, seekerName, seekerEmail, companyName, jobTitle, jobUrl, noticePeriod, skills, experience, bio, linkedIn, message, resumeUrl }) => base(`
//     <p>Hi <strong>${referrerName}</strong>,</p>
//     <p>You referred <strong>${seekerName}</strong> for a role at <strong>${companyName}</strong>. Here are their full details to help you submit the referral internally.</p>

//     <div class="info-box">
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Name</span><span style="color:#0f0e17;font-weight:600;text-align:right">${seekerName}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Email</span><span style="color:#0f0e17;font-weight:600;text-align:right">${seekerEmail}</span></div>
//       <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role Applied For</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle}</span></div>
//       ${noticePeriod ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Notice Period</span><span style="color:#0f0e17;font-weight:600;text-align:right">${noticePeriod}</span></div>` : ""}
//       ${experience !== null ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Experience</span><span style="color:#0f0e17;font-weight:600;text-align:right">${experience} year${experience !== 1 ? "s" : ""}</span></div>` : ""}
//       ${skills?.length > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Skills</span><span style="color:#0f0e17;font-weight:600;text-align:right">${skills.join(", ")}</span></div>` : ""}
//     </div>

//     ${bio ? `<div class="info-box"><p style="margin:0;font-size:14px"><strong>About:</strong><br>${bio}</p></div>` : ""}

//     <div class="info-box">
//       <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280">Why they think they're a good fit:</p>
//       <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${message}</p>
//     </div>

//     <div style="display:flex;gap:10px;flex-wrap:wrap;margin:20px 0">
//       ${jobUrl ? `<a href="${jobUrl}" class="btn" style="background:#6c47ff;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600">View Job Posting →</a>` : ""}
//       ${linkedIn ? `<a href="${linkedIn}" style="background:#0A66C2;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600">LinkedIn Profile →</a>` : ""}
//     </div>

//     ${resumeUrl ? `<p style="font-size:13px;color:#6b7280">📎 <strong>Resume is attached</strong> to this email.</p>` : ""}
//     <p style="font-size:13px;color:#9ca3af;margin-top:16px">This email was sent because the candidate opted to share their details with you. You can use this information to submit the referral through your company's internal portal.</p>
//   `),

//   // Intentionally removed: newApplicationForReferrer (in-app bell covers this)
//   // Intentionally removed: applicationForwarded (internal plumbing, seeker doesn't need this)
// };



import { Resend } from "resend";

const FROM = "Refrll <onboarding@resend.dev>"; // change to your domain once verified on Resend

let resend = null;
const getResend = () => {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`);
    return;
  }
  console.log(`[EMAIL] Sending to: ${to} | Subject: ${subject}`);
  try {
    // Resolve URL attachments — fetch and convert to base64 for Resend
    const resolvedAttachments = await Promise.all(
      attachments.map(async ({ url, filename }) => {
        try {
          const res = await fetch(url.split("?")[0]);
          if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
          const buffer = Buffer.from(await res.arrayBuffer());
          return { filename, content: buffer };
        } catch (err) {
          console.error("Attachment fetch failed:", err.message);
          return null;
        }
      })
    );

    const { error } = await getResend().emails.send({
      from: FROM,
      to,
      subject,
      html,
      attachments: resolvedAttachments.filter(Boolean),
    });

    if (error) {
      console.error("[EMAIL] Resend error:", error.message);
    } else {
      console.log(`[EMAIL] Successfully sent to: ${to}`);
    }
  } catch (err) {
    console.error("[EMAIL] Send failed:", err.message);
  }
};

// ── Base template ─────────────────────────────────────────────────────────────
const base = (content) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:'DM Sans',Arial,sans-serif;background:#faf9ff;margin:0;padding:0;color:#0f0e17}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e0f5}
  .header{background:linear-gradient(135deg,#6c47ff,#8b6dff);padding:32px;text-align:center}
  .header h1{color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px}
  .header p{color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px}
  .body{padding:32px}
  .btn{display:inline-block;background:#6c47ff;color:#fff!important;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px;margin:20px 0}
  .info-box{background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0}
  .footer{text-align:center;padding:20px;font-size:12px;color:#9ca3af;border-top:1px solid #f0eeff}
  p{font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px}
</style>
</head><body>
<div class="wrap">
  <div class="header"><h1>Refrll</h1><p>Your referral network</p></div>
  <div class="body">${content}</div>
  <div class="footer">© ${new Date().getFullYear()} Refrll · <a href="https://refrll.com" style="color:#6c47ff">refrll.com</a><br>You're receiving this because you have an account on Refrll.</div>
</div>
</body></html>`;

// ── Templates ─────────────────────────────────────────────────────────────────
export const emails = {

  verifyEmail: ({ name, verifyUrl }) => base(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thanks for joining Refrll! Please verify your email address to activate your account.</p>
    <div style="text-align:center"><a href="${verifyUrl}" class="btn">Verify Email Address</a></div>
    <p style="font-size:13px;color:#9ca3af;text-align:center">This link expires in 24 hours. If you didn't create a Refrll account, you can safely ignore this email.</p>
  `),

  forgotPassword: ({ name, resetUrl }) => base(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your Refrll password. Click the button below to choose a new password.</p>
    <div style="text-align:center"><a href="${resetUrl}" class="btn">Reset My Password</a></div>
    <p style="font-size:13px;color:#9ca3af;text-align:center">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
  `),

  applicationReceived: ({ seekerName, companyName, jobTitle }) => base(`
    <p>Hi <strong>${seekerName}</strong>,</p>
    <p>Your referral request has been received and is being reviewed.</p>
    <div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Status</span><span style="color:#0f0e17;font-weight:600;text-align:right">Under Review</span></div>
    </div>
    <p>We'll email you as soon as your referrer takes action — usually within 48 hours.</p>
  `),

  applicationReferred: ({ seekerName, companyName, jobTitle, referrerNote }) => base(`
    <p>Hi <strong>${seekerName}</strong>,</p>
    <p>🎉 Great news! You've been referred for a role at <strong>${companyName}</strong>.</p>
    <div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Status</span><span style="color:#10b981;font-weight:600">✓ Referred</span></div>
    </div>
    ${referrerNote ? `<div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0"><p style="margin:0;font-size:14px;color:#374151"><strong>Note from your referrer:</strong><br>${referrerNote}</p></div>` : ""}
    <p>The referral has been submitted internally. The hiring team will reach out directly if your profile is shortlisted. Best of luck! 🚀</p>
  `),

  applicationDeclined: ({ seekerName, companyName, jobTitle, reason }) => base(`
    <p>Hi <strong>${seekerName}</strong>,</p>
    <p>Your referral request for <strong>${companyName}</strong> was reviewed and the referrer was unable to proceed at this time.</p>
    <div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Company</span><span style="color:#0f0e17;font-weight:600;text-align:right">${companyName}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle || "Not specified"}</span></div>
    </div>
    ${reason ? `<div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0"><p style="margin:0;font-size:14px;color:#374151"><strong>Feedback:</strong><br>${reason}</p></div>` : ""}
    <p>Don't be discouraged — you can apply to other companies on Refrll. Each referrer has different criteria.</p>
  `),

  candidateDetailsForReferrer: ({ referrerName, seekerName, seekerEmail, companyName, jobTitle, jobUrl, noticePeriod, skills, experience, bio, linkedIn, message, resumeUrl }) => base(`
    <p>Hi <strong>${referrerName}</strong>,</p>
    <p>You referred <strong>${seekerName}</strong> for a role at <strong>${companyName}</strong>. Here are their full details to help you submit the referral internally.</p>

    <div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Name</span><span style="color:#0f0e17;font-weight:600;text-align:right">${seekerName}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Email</span><span style="color:#0f0e17;font-weight:600;text-align:right">${seekerEmail}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Role Applied For</span><span style="color:#0f0e17;font-weight:600;text-align:right">${jobTitle}</span></div>
      ${noticePeriod ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Notice Period</span><span style="color:#0f0e17;font-weight:600;text-align:right">${noticePeriod}</span></div>` : ""}
      ${experience !== null ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Experience</span><span style="color:#0f0e17;font-weight:600;text-align:right">${experience} year${experience !== 1 ? "s" : ""}</span></div>` : ""}
      ${skills?.length > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e4e0f5;font-size:14px"><span style="color:#6b7280;font-weight:500;padding-right:16px">Skills</span><span style="color:#0f0e17;font-weight:600;text-align:right">${skills.join(", ")}</span></div>` : ""}
    </div>

    ${bio ? `<div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0"><p style="margin:0;font-size:14px"><strong>About:</strong><br>${bio}</p></div>` : ""}

    <div style="background:#f4f2ff;border-radius:12px;padding:16px 20px;margin:16px 0">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280">Why they think they're a good fit:</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${message}</p>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:20px 0">
      ${jobUrl ? `<a href="${jobUrl}" class="btn" style="background:#6c47ff;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600">View Job Posting →</a>` : ""}
      ${linkedIn ? `<a href="${linkedIn}" style="background:#0A66C2;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600">LinkedIn Profile →</a>` : ""}
    </div>

    ${resumeUrl ? `<p style="font-size:13px;color:#6b7280">📎 <strong>Resume is attached</strong> to this email.</p>` : ""}
    <p style="font-size:13px;color:#9ca3af;margin-top:16px">This email was sent because the candidate opted to share their details with you. You can use this information to submit the referral through your company's internal portal.</p>
  `),

  // Intentionally removed: newApplicationForReferrer (in-app bell covers this)
  // Intentionally removed: applicationForwarded (internal plumbing, seeker doesn't need this)
};