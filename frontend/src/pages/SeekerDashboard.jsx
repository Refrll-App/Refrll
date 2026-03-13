import { useMemo, memo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { useGetSeekerApplicationsQuery } from "../features/seeker/applicationApi.js";
import { Card, EmptyState } from "../components/ui/index.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Link } from "react-router-dom";

const STATUS = {
  APPLIED:               { label: "Under Review",   color: "bg-accent-soft text-accent",       dot: "bg-accent animate-pulse" },
  REFERRED:              { label: "Referred ✓",      color: "bg-emerald-soft text-emerald-700", dot: "bg-emerald-500"          },
  NOT_SHORTLISTED:       { label: "Not Shortlisted", color: "bg-rose-50 text-rose-600",         dot: "bg-rose-400"             },
  NO_REFERRER_AVAILABLE: { label: "No Referrer Yet", color: "bg-amber-soft text-amber-700",     dot: "bg-amber-400"            },
  FORWARDED:             { label: "Forwarded",       color: "bg-slate-100 text-slate-600",      dot: "bg-slate-400"            },
};

const RecentApplicationCard = memo(function RecentApplicationCard({ app }) {
  const s        = STATUS[app.status] || STATUS.APPLIED;
  const initials = useMemo(() =>
    (app.companyId?.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    [app.companyId?.name]
  );
  const date = useMemo(() =>
    new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    [app.createdAt]
  );
  return (
    <div className="flex items-center gap-3 py-3 border-b border-default last:border-0">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center font-display font-bold text-accent text-xs flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink text-sm truncate">{app.companyId?.name || "—"}</p>
        <p className="text-xs text-ink-muted truncate">{app.jobTitle || app.jobId || "Role not specified"}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
          {s.label}
        </span>
        <span className="text-xs text-ink-faint">{date}</span>
      </div>
    </div>
  );
});

export default function SeekerDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetSeekerApplicationsQuery({ page: 1, limit: 5 });
  const { applications = [], pagination } = data || {};

  const firstName = useMemo(() => user?.name?.split(" ")[0] || "there", [user?.name]);
  const isProfileComplete = Boolean(user?.resumeUrl && user?.name);

  const stats = useMemo(() => ({
    total:    pagination?.total || 0,
    referred: applications.filter((a) => a.status === "REFERRED").length,
    active:   applications.filter((a) => ["APPLIED","FORWARDED"].includes(a.status)).length,
  }), [applications, pagination]);

  return (
    <div className="space-y-6 fade-in ">
      {/* max-w-3xl */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Hi, {firstName} 👋</h1>
        <p className="text-ink-muted text-sm mt-1">Here's your job search at a glance</p>
      </div>

      {!isProfileComplete && (
        <div className="bg-amber-soft border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Complete your profile first</p>
              <p className="text-xs text-amber-700 mt-0.5">Upload your resume to start applying for referrals</p>
            </div>
          </div>
          <Link to="/profile" className="text-xs font-medium text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap flex-shrink-0">
            Complete Profile
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/find-referrals" className="group bg-gradient-to-br from-accent to-accent-hover rounded-2xl p-5 text-white hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="text-3xl mb-3">🎯</div>
          <p className="font-display font-bold text-lg">Find Referrals</p>
          <p className="text-white/80 text-sm mt-1">Browse companies with active referrers</p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-white/90 group-hover:gap-2 transition-all">Browse now <span>→</span></div>
        </Link>
        <Link to="/my-applications" className="group bg-white border border-default rounded-2xl p-5 hover:shadow-card-hover transition-all hover:-translate-y-0.5">
          <div className="text-3xl mb-3">📋</div>
          <p className="font-display font-bold text-lg text-ink">My Applications</p>
          <p className="text-ink-muted text-sm mt-1">Track status of your referral requests</p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">View all <span>→</span></div>
        </Link>
      </div>

      {!isLoading && stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Applied", value: stats.total,    color: "text-ink"          },
            { label: "In Progress",   value: stats.active,   color: "text-accent"       },
            { label: "Referred",      value: stats.referred, color: "text-emerald-600"  },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-default p-4 text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-faint mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-ink">Recent Applications</h2>
          {stats.total > 0 && (
            <Link to="/my-applications" className="text-xs text-accent hover:underline font-medium">
              View all {stats.total} →
            </Link>
          )}
        </div>
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-20" /></div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon="🚀"
              title="No applications yet"
              description="Find a company and submit your first referral request"
              action={
                <Link to="/find-referrals" className="mt-4 inline-block text-sm font-medium px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors">
                  Browse Companies →
                </Link>
              }
            />
          ) : (
            <div className="px-4">
              {applications.slice(0, 5).map((app) => (
                <RecentApplicationCard key={app._id} app={app} />
              ))}
              {stats.total > 5 && (
                <div className="py-3 text-center">
                  <Link to="/my-applications" className="text-xs text-accent font-medium hover:underline">
                    + {stats.total - 5} more applications →
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
