

import { useEffect, useMemo, useState } from 'react';
import { useJobs } from "../../hooks/useJobs";
import JobCard from "../../components/common/JobCard";
import SkeletonJobCard from "../../components/common/SkeletonJobCard";
import { useProfile } from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { debounce } from 'lodash';


export default function JobsListingPage() {
  const { data: user } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  // filters from URL params
  const filters = {
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    skills: searchParams.get("skills") || "",
    remote: searchParams.get("remote") === "true",
  };

  // local states for inputs
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(filters.location);
  const [skillsInput, setSkillsInput] = useState(filters.skills);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const tab = searchParams.get("tab") || "company";

  // sync local state when URL param changes externally
  useEffect(() => { setKeywordInput(filters.keyword); }, [filters.keyword]);
  useEffect(() => { setLocationInput(filters.location); }, [filters.location]);
  useEffect(() => { setSkillsInput(filters.skills); }, [filters.skills]);

  const setTab = (t) => setSearchParams({ tab: t });

  // debounce handler
  const debouncedHandleFilter = useMemo(() => debounce((key, value) => {
    handleFilter(key, value);
  }, 500), [searchParams]);

  useEffect(() => {
    return () => debouncedHandleFilter.cancel();
  }, [debouncedHandleFilter]);

  const handleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    
    params.set("page", "1");
    
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  };

  const updatePage = (newPage) => {
    if (newPage === page) return;
    
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  };

  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // API call with filters
  const { data, isFetching } = useJobs(
    {
      keyword: filters.keyword,
      location: filters.location,
      skills: filters.skills,
      remote: filters.remote,
      type: searchParams.get("tab") || "company",
      excludePostedBy: user?.type === "employee" ? user._id : undefined,
    },
    Number(searchParams.get("page")) || 1,
    9
  );

 

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
      {/* Compact Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Search Bar */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                placeholder="Search jobs, companies..."
                value={keywordInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setKeywordInput(val);
                  debouncedHandleFilter("keyword", val);
                }}
                className="w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="w-48 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                placeholder="Location"
                value={locationInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationInput(val);
                  debouncedHandleFilter("location", val);
                }}
                className="w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="w-48 relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                placeholder="Skills"
                value={skillsInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSkillsInput(val);
                  debouncedHandleFilter("skills", val);
                }}
                className="w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-medium rounded-md transition-all duration-200">
              Search
            </button>
          </div>

          {/* Tabs and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTab("company")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === "company"
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 inline mr-1" />
                Company Jobs
              </button>
              <button
                onClick={() => setTab("referral")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === "referral"
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Users className="w-3.5 h-3.5 inline mr-1" />
                Referral Jobs
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => handleFilter("remote", e.target.checked ? "true" : "")}
                  className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700 dark:text-slate-300">Remote</span>
              </label>
              
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>{data?.jobs?.length || 0} jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Job List */}
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : data?.jobs?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-xs">
              Try adjusting your search criteria
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
                setPage(1);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-medium rounded-md transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => updatePage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
              let pageNum;
              const totalPages = data.totalPages;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => updatePage(pageNum)}
                  className={`w-8 h-8 text-xs font-medium rounded transition-colors ${
                    pageNum === page
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => updatePage(Math.min(data.totalPages, page + 1))}
              disabled={page === data.totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}