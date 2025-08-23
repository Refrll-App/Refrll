



import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, ChevronRight, Building } from "lucide-react";

const statusColor = {
  applied: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  shortlisted: "bg-teal-100 text-teal-800 animate-pulse dark:bg-teal-900/50 dark:text-teal-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  hired: "bg-green-100 text-green-800 animate-pulse dark:bg-green-900/50 dark:text-green-200",
};

export default function ApplicationCard({ app }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden
                   dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-900/30">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        {/* Company Logo */}
        <div className="mt-1">
          {app.jobId.companyId?.logo ? (
            <img 
              src={app.jobId.companyId.logo} 
              alt={app.jobId.companyId.name} 
              className="w-10 h-10 rounded-lg object-contain border border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center w-10 h-10
                            dark:bg-gray-700 dark:border-gray-600">
              <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/jobs/${app.jobId._id}`}
              className="text-base font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200 truncate block
                         dark:text-white dark:hover:text-indigo-400"
            >
              {app.jobId.title}
            </Link>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                statusColor[app.status]
              }`}
            >
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate mt-1 dark:text-gray-400">
            {app.jobId.companyId?.name || "Unknown Company"}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0 dark:text-indigo-400" />
              <span className="truncate">{app.jobId.location || "Remote"}</span>
              {app.jobId.remote && (
                <span className="ml-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full whitespace-nowrap
                                 dark:bg-teal-900/50 dark:text-teal-200">
                  Remote
                </span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-indigo-500 flex-shrink-0 dark:text-indigo-400" />
              <span className="truncate">{app.jobId.employmentType || "Full-time"}</span>
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="flex items-center gap-1 text-gray-600 text-xs dark:text-gray-400">
              <Clock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              Applied: {new Date(app.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
            <div>
              <Link
                to={`/jobs/${app.jobId._id}`}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-semibold transition-colors duration-200 whitespace-nowrap
                           dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View Details
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}