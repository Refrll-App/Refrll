/**
 * Converts a Cloudinary resume URL to force download with the seeker's name as filename.
 * Uses Cloudinary's fl_attachment transformation — no backend proxy needed.
 */
export const resumeDownloadUrl = (url, name) => {
  if (!url) return "";
  const safeName = (name || "Resume").replace(/[^a-zA-Z0-9]/g, "_");
  return url.replace("/upload/", `/upload/fl_attachment:${safeName}_Resume/`);
};