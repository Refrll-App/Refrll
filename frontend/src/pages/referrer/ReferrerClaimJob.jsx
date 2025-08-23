




import React, { useState, useCallback, useEffect } from "react";
import { useClaimJob, useCompanyJobsToClaim } from "../../hooks/useJobs";
import SkeletonJobCard from "../../components/common/SkeletonJobCard";
import CompanyJobCard from "../../components/common/CompanyJobCard";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";


const ReferrerClaimJob = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [experienceFilter, setExperienceFilter] = useState(
    searchParams.get("experience") || ""
  );
  const [skillsFilter, setSkillsFilter] = useState(
    searchParams.get("skills") || ""
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const limit = 9;

  const { data: claimable, isLoading: loadingClaim } = useCompanyJobsToClaim({
    search: searchTerm,
    experience: experienceFilter,
    skills: skillsFilter,
    page,
    limit,
  });




  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (skillsFilter) params.skills = skillsFilter;
    if (experienceFilter) params.experience = experienceFilter;
    if (page !== 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [searchTerm, skillsFilter, experienceFilter, page]);

  const { mutate: claim, isPending } = useClaimJob();
  const navigate = useNavigate();

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 1000),
    []
  );

  const handleClaim = (jobId) => {
    claim(jobId, {
      onSuccess: () => toast.success("Job claimed successfully!"),
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to claim job");
      },
    });
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setExperienceFilter("");
    setSkillsFilter("");
    setPage(1);
  }, []);

  const updatePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params ,{ replace: true });
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              Find Jobs to Refer Candidates
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs">
              Claim job listings to refer qualified candidates and help them
              build their careers
            </p>
          </div>

          <button
            onClick={() => navigate("/employee/referrer")}
            className="bg-white dark:bg-slate-800 border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            View My Referrals
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3 mb-3 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, title or skills..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={skillsFilter}
              onChange={(e) => {
                setSkillsFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by skill..."
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
              <svg
                className="fill-current h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={experienceFilter}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent appearance-none dark:bg-slate-700 dark:text-white"
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Experience</option>
              <option value="0-2">0-2 years</option>
              <option value="2-4">2-4 years</option>
              <option value="4-6">4-6 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
              <svg
                className="fill-current h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {(searchTerm || skillsFilter || experienceFilter) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-1">
              {searchTerm && (
                <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {skillsFilter && (
                <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  Skill: {skillsFilter}
                  <button
                    onClick={() => setSkillsFilter("")}
                    className="ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {experienceFilter && (
                <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  Exp: {experienceFilter}
                  <button
                    onClick={() => setExperienceFilter("")}
                    className="ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </p>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Claimable company jobs */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
            <span className="mr-2 bg-gradient-to-r from-indigo-500 to-purple-500 w-1.5 h-5 rounded-full"></span>
            Available Jobs to Claim
          </h2>

          <div className="flex items-center gap-2">
            <div className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
         {claimable?.jobs?.length || 0} {claimable?.jobs?.length === 1 ? "job" : "jobs"}

            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Page {page} of {claimable?.totalPages || 1}
            </div>
          </div>
        </div>

        {loadingClaim ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : claimable?.jobs?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {claimable.jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-md"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                <CompanyJobCard
                  job={job}
                  onClaim={() => handleClaim(job._id)}
                  isClaiming={isPending}
                  showClaimButton={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-5 text-center border border-dashed border-slate-300 dark:border-slate-700 max-w-2xl mx-auto shadow-sm">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">
              No matching jobs found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3">
              {searchTerm || skillsFilter || experienceFilter
                ? "Try adjusting your filters to find more opportunities"
                : "There are currently no jobs available to claim. Check back later."}
            </p>
            {(searchTerm || skillsFilter || experienceFilter) && (
              <button
                onClick={clearFilters}
                className="border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Pagination */}
      {claimable?.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 gap-3">
          <button
            onClick={() => updatePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded border text-xs ${
              page === 1
                ? "border-slate-300 dark:border-slate-600 text-slate-400 cursor-not-allowed"
                : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, claimable.totalPages) }).map(
              (_, i) => {
                const pageNum =
                  page <= 3
                    ? i + 1
                    : page >= claimable.totalPages - 2
                    ? claimable.totalPages - 4 + i
                    : page - 2 + i;

                if (pageNum < 1 || pageNum > claimable.totalPages) return null;

                return (
                  <button
                    key={i}
                    onClick={() => updatePage(pageNum)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                      page === pageNum
                        ? "bg-indigo-500 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
            {claimable.totalPages > 5 && page < claimable.totalPages - 2 && (
              <span className="px-2 py-1 text-slate-500 text-xs">...</span>
            )}
            {claimable.totalPages > 5 && page < claimable.totalPages - 2 && (
              <button
                onClick={() => updatePage(claimable.totalPages)}
                className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                  page === claimable.totalPages
                    ? "bg-indigo-500 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {claimable.totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => updatePage(Math.min(claimable.totalPages, page + 1))}
            disabled={page === claimable.totalPages}
            className={`flex items-center gap-1 px-3 py-1 rounded border text-xs ${
              page === claimable.totalPages
                ? "border-slate-300 dark:border-slate-600 text-slate-400 cursor-not-allowed"
                : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferrerClaimJob;