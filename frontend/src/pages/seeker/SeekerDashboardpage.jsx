

// src/pages/seeker/SeekerDashboardPage.jsx
import { useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase,
  ArrowRight, ChevronRight
} from "lucide-react";
import { useMyApplications } from "../../hooks/useJobs";
import SkeletonJobCard from "../../components/common/SkeletonJobCard";
import { useProfile } from "../../hooks/useAuth";

// Lazy-loaded components
const ApplicationCard = lazy(() => import("../../components/common/ApplicationCard"));
const ProfileSummary = lazy(() => import("./ProfileSummary"));
const ApplicationStats = lazy(() => import("./ApplicationStats"));

const MemoizedProfileSummary = ({ user }) => (
  <Suspense fallback={<ProfileSummarySkeleton />}>
    <ProfileSummary user={user} />
  </Suspense>
);

const MemoizedApplicationStats = ({ applications }) => (
  <Suspense fallback={<StatsSkeleton />}>
    <ApplicationStats applications={applications} />
  </Suspense>
);

const ProfileSummarySkeleton = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 mb-4">
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
        <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
          <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
    <div className="flex flex-wrap gap-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      ))}
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
    <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="h-4 w-14 bg-gray-200 dark:bg-gray-600 rounded mb-1 animate-pulse" />
          <div className="h-3 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse" />
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 animate-pulse" />
    <div className="flex flex-wrap gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

export default function SeekerDashboardPage() {
  const { data: applications, isLoading } = useMyApplications();
  const { data: user } = useProfile();

  const recentApplications = useMemo(() => {
    if (!applications) return [];
    return [...applications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [applications]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-[#8f94fb] to-[#4e54c8] bg-clip-text text-transparent font-bold text-2xl md:text-3xl">
            {user?.name?.split(" ")[0] || "User"}!
          </span>
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Here's your job search dashboard
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-4">
          <MemoizedProfileSummary user={user} />
        </div>

        {/* Right Column - Application Stats */}
        <div className="lg:col-span-1">
          <MemoizedApplicationStats applications={applications} />
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            Recent Applications
          </h2>
          
          {applications?.length > 0 && ( 
            <Link 
              to="/employee/seekerApplications"
              className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-medium"
            >
              View all
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonJobCard key={i} />
            ))}
          </div>
        ) : recentApplications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Suspense fallback={<SkeletonJobCard />}>
                {recentApplications.map((app) => (
                  <ApplicationCard key={app._id} app={app} />
                ))}
              </Suspense>
            </div>
            
            {applications.length > 4 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/employee/seekerApplications"
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                >
                  View All Applications ({applications.length})
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-3">
              <Briefcase size={24} />
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
              No applications yet
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start your job search today!
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
            >
              Browse Jobs
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}