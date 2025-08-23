import { MapPin, Building2, ExternalLink } from "lucide-react";

const JobCard = ({ job }) => {
  const user = { type: "employee", resumeUrl: "resume.pdf" };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  const canApply = user?.type === "employee" && user?.resumeUrl;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 p-5 relative group w-full">
      {/* Company + Time Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {job.companyId.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
              {job.remote && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-[11px]">
                  🌍 Remote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {timeAgo(job.createdAt)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {job.applicationCount <= 100 ? job.applicationCount : "100+"}{" "}
            {job.applicationCount === 1 ? "applicant" : "applicants"}
          </span>
        </div>
      </div>

      {/* Job Title + Description */}
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
        {job.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
        {job.description ||
          "Join our team to work on exciting projects and grow your career with a fast-paced, collaborative environment."}
      </p>

      {/* Experience */}
      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        <span className="font-medium">Experience: </span>
        {job?.experienceRequired?.min === job?.experienceRequired?.max
          ? `${job?.experienceRequired?.min} years`
          : `${job?.experienceRequired?.min} - ${job.experienceRequired?.max} years`}
      </div>

      {/* Skills */}
      <div className="mb-3">
        <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Required Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="bg-indigo-100 border border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-200 text-xs px-2.5 py-0.5 rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 3 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">
              +{job.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Salary & Actions */}
      <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
            Salary Range
          </p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            ₹{job?.salaryRange?.min} - {job?.salaryRange?.max} LPA
          </p>
        </div>

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

          className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition flex items-center gap-1.5 font-bold shadow-sm"
        >
          View Details <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
