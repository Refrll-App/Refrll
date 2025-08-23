import { useMyReferrals } from '../../hooks/useJobs';
import ReferralCard from '../../components/common/ReferralCard';
import SkeletonJobCard from '../../components/common/SkeletonJobCard';

export default function ReferrerJobsPage() {
  const { data: referrals, isLoading } = useMyReferrals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        My Referral Jobs
      </h1>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonJobCard key={i} />)}
        </div>
      ) : referrals?.jobs?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {referrals.jobs.map(job => <ReferralCard key={job._id} job={job} />)}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">No referral jobs yet.</p>
      )}
    </div>
  );
}