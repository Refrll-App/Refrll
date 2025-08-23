

import { useMemo } from "react";
import { BarChart2 } from "lucide-react";

export default function ApplicationStats({ applications }) {
  const stats = useMemo(() => {
    const total = applications?.length || 0;
    const shortlisted = applications?.filter(a => a.status === "shortlisted").length || 0;
    const hired = applications?.filter(a => a.status === "accepted").length || 0;
    const rejected = applications?.filter(a => a.status === "rejected").length || 0;
    const inReview = applications?.filter(a => a.status === "applied").length || 0;

    return {
      total,
      shortlisted,
      hired,
      rejected,
      inReview,
      shortlistedPercent: total ? Math.round((shortlisted / total) * 100) : 0,
      hiredPercent: total ? Math.round((hired / total) * 100) : 0,
      rejectedPercent: total ? Math.round((rejected / total) * 100) : 0,
      inReviewPercent: total ? Math.round((inReview / total) * 100) : 0,
    };
  }, [applications]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
          <BarChart2 size={16} />
        </div>
        Application Stats
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Applications
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.shortlisted}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Shortlisted
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.hired}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Hired</div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.rejected}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Rejected
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            Status Distribution
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex overflow-hidden">
          <div className="bg-blue-500" style={{ width: `${stats.inReviewPercent}%` }} />
          <div className="bg-amber-500" style={{ width: `${stats.shortlistedPercent}%` }} />
          <div className="bg-green-500" style={{ width: `${stats.hiredPercent}%` }} />
          <div className="bg-rose-500" style={{ width: `${stats.rejectedPercent}%` }} />
        </div>

        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Review: {stats.inReviewPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Shortlisted: {stats.shortlistedPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Hired: {stats.hiredPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            <span>Rejected: {stats.rejectedPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}