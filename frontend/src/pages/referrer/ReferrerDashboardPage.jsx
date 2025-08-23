
import {
  useMyReferrals,
} from "../../hooks/useJobs";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";


export default function ReferrerDashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { data: referrals, isLoading: loadingRefs } = useMyReferrals(page);

  // Calculate stats
  const totalApplicantsReferred =
    referrals?.jobs?.reduce(
      (total, job) => total + (job.referrals?.length || 0),
      0
    ) || 0;

  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" }, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Welcome back!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Let's refer someone and build their career. Share opportunities
              and make an impact today!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
            {/* Jobs Posted */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {referrals?.totalCount||0}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Total Jobs Posted
              </div>
            </div>
          </div>
        </div>

        {/* Referral Call to Action */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-3 md:mb-0">
              <h2 className="text-base font-bold mb-1">
                Got a talented connection?
              </h2>
              <p className="opacity-90 text-xs max-w-md">
                Refer qualified candidates and help them land their dream job
                while earning rewards.
              </p>
            </div>
            <button
              onClick={() => navigate("/employee/claimJob")}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg text-xs shadow-sm dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700"
            >
              Refer Someone Now
            </button>
          </div>
        </div>

        {/* My Referrals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <span className="mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 w-1.5 h-5 rounded-full"></span>
              My Referral Jobs
            </h2>
            <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {referrals?.totalCount} jobs • {totalApplicantsReferred} referrals
            </div>
          </div>

          {loadingRefs ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <table className="min-w-full bg-white dark:bg-slate-800 text-xs">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  <tr>
                    {[...Array(6)].map((_, i) => (
                      <th key={i} className="px-3 py-2 text-left">
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-3 bg-slate-100 dark:bg-slate-600/50 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : referrals?.jobs?.length ? (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200">
                  <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                    <tr className="text-slate-700 dark:text-slate-300 text-left">
                      <th className="px-3 py-3 font-medium min-w-[160px]">Job Title</th>
                      <th className="px-3 py-3 font-medium min-w-[100px]">Location</th>
                      <th className="px-3 py-3 font-medium min-w-[90px]">Salary</th>
                      <th className="px-3 py-3 font-medium w-24 text-center">Applicants</th>
                      <th className="px-3 py-3 font-medium min-w-[100px]">Posted On</th>
                      <th className="px-3 py-3 font-medium w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {referrals.jobs.map((job) => {
                      const now = new Date();
                      const deadline = new Date(job.deadline || now);
                      const daysLeft = Math.ceil((deadline - now) / 86400000);
                      const isClosed = deadline < now;
                      const status = isClosed
                        ? "Closed"
                        : daysLeft <= 3
                        ? `Closing in ${daysLeft}d`
                        : "Active";

                      return (
                        <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td 
                            className="px-3 py-3 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                            // onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
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

                          >
                            {job.title}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              {job.location || "Remote"}
                              {job.remote && (
                                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-2xs px-1.5 py-0.5 rounded-full">
                                  Remote
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2">  
                            ₹ {job.salaryRange?.min} - {job.salaryRange?.max} LPA
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full px-2 py-0.5">
                              {job.applicationCount || 0}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                            {format(new Date(job.createdAt), "MMM dd, yyyy")}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => navigate(`/employee/referrals/${job._id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 text-xs font-medium transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 max-w-2xl mx-auto shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                No referral jobs yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                You haven't referred any candidates yet. Start building careers today!
              </p>
              <button
                onClick={() => navigate("/employee/claimJob")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-5 rounded-lg shadow-sm"
              >
                Make Your First Referral
              </button>
            </div>
          )}

          {referrals?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => updatePage(page - 1)}
                disabled={page === 1}
                className="px-2.5 py-1 rounded border text-xs disabled:opacity-50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              >
                Prev
              </button>

              {Array.from({ length: referrals.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updatePage(i + 1)}
                  className={`px-2.5 py-1 rounded border text-xs border-slate-300 dark:border-slate-600 ${
                    page === i + 1 
                      ? "bg-indigo-500 text-white" 
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => updatePage(page + 1)}
                disabled={page === referrals.totalPages}
                className="px-2.5 py-1 rounded border text-xs disabled:opacity-50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}