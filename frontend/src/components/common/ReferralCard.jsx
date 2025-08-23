import {
  Building2,
  MapPin,
  Users,
  ExternalLink,
  BadgeDollarSign,
  CalendarClock,
  CircleDot,
} from "lucide-react";
import { useApplicationsForJob } from "../../hooks/useJobs";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function ReferralCard({ job }) {
  const { data } = useApplicationsForJob(job._id);
  const count = data?.length || 0;
  const navigate = useNavigate();

  // Calculate status indicator
  const getStatusInfo = () => {
    const now = new Date();
    const deadline = new Date(job.deadline);

    if (deadline < now) {
      return { text: "Closed", color: "bg-rose-100 text-rose-800" };
    }

    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) {
      return {
        text: `Closing in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
        color: "bg-amber-100 text-amber-800",
      };
    }

    return { text: "Active", color: "bg-emerald-100 text-emerald-800" };
  };

  const statusInfo = getStatusInfo();
  const formattedDate = job.createdAt
    ? format(new Date(job.createdAt), "MMM dd, yyyy")
    : "N/A";

  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden text-sm">
      {/* Status Indicator */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color} z-10`}
      >
        {statusInfo.text}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Header: Logo & Job Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-slate-100 border border-dashed rounded-xl w-12 h-12 flex items-center justify-center text-slate-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1">
              Posted: {formattedDate}
            </span>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
              <Building2 className="w-4 h-4" />
              {job.companyId?.name || "Unknown Company"}
            </p>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="font-medium text-slate-700 text-xs">
                {job.location || "Remote"}{" "}
                {job.remote && (
                  <span className="text-xs text-emerald-600 ml-1">
                    (Remote)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <BadgeDollarSign className="w-4 h-4 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Salary</p>
              <p className="font-medium text-slate-700 text-xs">
                ₹{job.salaryRange?.min}k - {job.salaryRange?.max}k
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Applicants</p>
              <p className="font-medium text-slate-700 text-xs">
                {count} {count === 1 ? "candidate" : "candidates"}
              </p>
            </div>
          </div>

          {/* <div className="flex items-start gap-2">
          <CalendarClock className="w-4 h-4 text-indigo-500 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Deadline</p>
            <p className="font-medium text-slate-700">
              {job.deadline ? format(new Date(job.deadline), "MMM dd") : "N/A"}
            </p>
          </div>
        </div> */}
        </div>

        {/* Key Skills */}
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
            <CircleDot className="w-4 h-4 text-indigo-500" /> Key Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired?.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md hover:bg-indigo-100 transition"
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired?.length > 4 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                +{job.skillsRequired.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          {/* View Details Button */}
          <button
            onClick={() => window.open(`/jobs/${job._id}`, "_blank")}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 text-sm font-semibold py-1.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
          >
            View Details
          </button>

          {/* Manage Referrals Button */}
          <button
            onClick={() => navigate(`/employee/referrals/${job._id}`)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold py-1.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Manage Referrals
          </button>
        </div>
      </div>
    </div>
  );
}
