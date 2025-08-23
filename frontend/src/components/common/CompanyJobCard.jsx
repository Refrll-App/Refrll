

import { Building2 } from "lucide-react";


const CompanyJobCard = ({ job, onClaim, isClaiming, showClaimButton = true }) => {
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-4">
      {/* Header with Posted Date */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start">
          <Building2 className="w-5 h-5 mr-3 mt-1 text-slate-700 dark:text-slate-300" />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {job.company?.name || "Unknown Company"}
            </p>
          </div>
        </div>
        
        {/* Posted Date - Top Right */}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {new Date(job.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
            {job.location || "Remote"}
            {job.remote && (
              <span className="text-indigo-600 dark:text-indigo-400 ml-1">
                (Remote)
              </span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
            {job.experienceRequired?.min != null && job.experienceRequired?.max != null
              ? `${job.experienceRequired.min} - ${job.experienceRequired.max} yrs`
              : "Any"}
          </p>
        </div>
      </div>

      {/* Job Description */}
      {job.description && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {job.description}
          </p>
        </div>
      )}

      {/* Skills Section */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          Key Skills
        </p>
        <div className="flex flex-wrap gap-1">
          {job.skillsRequired?.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 4 && (
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded">
              +{job.skillsRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          // onClick={() => window.open(`/jobs/${job._id}`, "_blank")}
          onClick={() => {
  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  if (isMobile) {
    // Navigate inside app
    window.location.href = `/jobs/${job._id}`;
  } else {
    // Open new tab on desktop
    window.open(`/jobs/${job._id}`, "_blank", "noopener,noreferrer");
  }
}}

          className="flex-1 text-xs font-medium py-2 px-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
        >
          View Details
        </button>

        {showClaimButton &&
          (job.claimedByMe ? (
            <div className="flex-1 flex items-center justify-center text-xs font-medium py-2 px-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
              Claimed
            </div>
          ) : (
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className={`flex-1 flex items-center justify-center text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
                isClaiming
                  ? "bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white"
              }`}
            >
              {isClaiming ? "Claiming..." : "Claim"}
            </button>
          ))}
      </div>
    </div>
  );
};

export default CompanyJobCard;