import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useApplicationsForHrJob,
  useUpdateApplicationStatus,
  useDownloadExcel,
} from "../../hooks/useJobs";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  FileText,
  Search,
  RefreshCw,
  X,
  Clock,
  Star,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    applied: {
      color: "bg-blue-100 text-blue-800",
      icon: <Clock className="w-4 h-4" />,
    },
    shortlisted: {
      color: "bg-amber-100 text-amber-800",
      icon: <Star className="w-4 h-4" />,
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: <X className="w-4 h-4" />,
    },
    hired: {
      color: "bg-green-100 text-green-800",
      icon: <UserCheck className="w-4 h-4" />,
    },
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
    >
      {statusConfig[status].icon}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
};

const ApplicationRow = ({ application, onStatusUpdate }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/20 w-8 h-8 rounded-full flex items-center justify-center">
            <User className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {application.seekerId.name}
            </div>
            <a
              href={`mailto:${application.seekerId.email}`}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 mt-1"
            >
              <Mail className="w-3 h-3" />
              {application.seekerId.email}
            </a>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">
        {application.seekerId.yearsOfExp || 0} years
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {(application.seekerId.skills || []).slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded"
            >
              {skill}
            </span>
          ))}
          {application.seekerId.skills?.length > 2 && (
            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
              +{application.seekerId.skills.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
        {new Date(application.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-4">
        <a
          // href={application.seekerId.resumeUrl}
          href={`${
            import.meta.env.VITE_SERVER_URL
          }/api/upload/download-resume/${application.seekerId._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm flex items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          View
        </a>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={application.status} />
      </td>
      <td className="py-4 pr-6 pl-3 relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {showActions && (
          <div className="absolute right-6 z-10 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="py-1">
              {["applied", "shortlisted", "rejected", "hired"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusUpdate(application._id, status);
                    setShowActions(false);
                  }}
                  disabled={application.status === status}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    application.status === status
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {status === "applied" && <Clock className="w-4 h-4" />}
                  {status === "shortlisted" && <Star className="w-4 h-4" />}
                  {status === "rejected" && <X className="w-4 h-4" />}
                  {status === "hired" && <UserCheck className="w-4 h-4" />}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

export default function HrApplicationsPage() {
  const { jobId } = useParams();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "createdAt",
    order: "desc",
    page: 1,
    limit: 10,
  });

  const {
    data: applicationsData,
    isLoading,
    refetch,
  } = useApplicationsForHrJob(jobId, filters);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateApplicationStatus();
  const { mutate: download } = useDownloadExcel();

  const handleStatusUpdate = (appId, status) => {
    updateStatus(
      { appId, status },
      {
        onSuccess: () => {
          toast.success("Status updated");
          refetch();
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Failed to update status"
          );
        },
      }
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, //
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= applicationsData.totalPages) {
      handleFilterChange("page", newPage);
    }
  };

  // const statusCounts = {
  //   all: applicationsData?.totalCount || 0,
  //   applied: applicationsData?.statusCounts?.applied || 0,
  //   shortlisted: applicationsData?.statusCounts?.shortlisted || 0,
  //   rejected: applicationsData?.statusCounts?.rejected || 0,
  //   hired: applicationsData?.statusCounts?.hired || 0,
  // };

  const statusCounts = applicationsData?.statusCounts || {
    all: 0,
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
  };

  if (!jobId) return <p className="p-4">Invalid job</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job Applicants
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Review and manage applications for this position
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => download(jobId)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 mb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search applicants..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 absolute left-3 bottom-3 text-slate-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="createdAt">Applied Date</option>
              <option value="yearsOfExp">Experience</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Order
            </label>
            <div className="flex">
              <button
                onClick={() => handleFilterChange("order", "asc")}
                className={`flex-1 py-2.5 rounded-l-lg border border-slate-200 dark:border-slate-700 text-sm ${
                  filters.order === "asc"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                Asc
              </button>
              <button
                onClick={() => handleFilterChange("order", "desc")}
                className={`flex-1 py-2.5 rounded-r-lg border-t border-b border-r border-slate-200 dark:border-slate-700 text-sm ${
                  filters.order === "desc"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                Desc
              </button>
            </div>
          </div>
        </div>

        {/* Status counts */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
          {["all", "applied", "shortlisted", "rejected", "hired"].map(
            (status) => (
              <button
                key={status}
                onClick={() => handleFilterChange("status", status)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filters.status === status
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <span className="bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full text-xs">
                  {statusCounts[status] || 0}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Experience
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Skills
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Applied
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Resume
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-6 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex justify-center">
                      <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    </div>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      Loading applications...
                    </p>
                  </td>
                </tr>
              ) : applicationsData?.applications?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-5">
                      <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No applications found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                      {filters.search || filters.status !== "all"
                        ? "No applicants match your current filters."
                        : "There are no applications for this job yet."}
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: "",
                          status: "all",
                          sort: "createdAt",
                          order: "desc",
                          page: 1,
                          limit: 10,
                        })
                      }
                      className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                applicationsData?.applications?.map((application) => (
                  <ApplicationRow
                    key={application._id}
                    application={application}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {applicationsData?.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-6 py-4">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              Showing{" "}
              <span className="font-medium">
                {(filters.page - 1) * filters.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  filters.page * filters.limit,
                  applicationsData.totalCount
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">{applicationsData.totalCount}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className={`p-1.5 rounded border ${
                  filters.page === 1
                    ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600"
                    : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from(
                { length: Math.min(5, applicationsData.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (applicationsData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= applicationsData.totalPages - 2) {
                    pageNum = applicationsData.totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded text-sm ${
                        filters.page === pageNum
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= applicationsData.totalPages}
                className={`p-1.5 rounded border ${
                  filters.page >= applicationsData.totalPages
                    ? "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600"
                    : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status update indicator */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Updating status...</span>
        </div>
      )}
    </div>
  );
}
