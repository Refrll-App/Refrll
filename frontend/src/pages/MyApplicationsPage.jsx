import { useState, useMemo, useCallback, memo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetSeekerApplicationsQuery } from "../features/seeker/applicationApi.js";
import { PageHeader, Card, EmptyState, Pagination } from "../components/ui/index.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";

const STATUS = {
  APPLIED:               { label: "Under Review",   color: "bg-accent-soft text-accent",          dot: "bg-accent",        icon: "🔍" },
  REFERRED:              { label: "Referred ✓",      color: "bg-emerald-soft text-emerald-700",    dot: "bg-emerald-500",   icon: "🎉" },
  NOT_SHORTLISTED:       { label: "Not Shortlisted", color: "bg-rose-50 text-rose-600",            dot: "bg-rose-400",      icon: "❌" },
  NO_REFERRER_AVAILABLE: { label: "No Referrer Yet", color: "bg-amber-soft text-amber-700",        dot: "bg-amber-400",     icon: "⏳" },
  FORWARDED:             { label: "Forwarded",       color: "bg-slate-100 text-slate-600",         dot: "bg-slate-400",     icon: "↗️" },
};

const FILTERS = [
  { value: "",                label: "All" },
  { value: "APPLIED",         label: "Under Review" },
  { value: "REFERRED",        label: "Referred" },
  { value: "FORWARDED",       label: "Forwarded" },
  { value: "NOT_SHORTLISTED", label: "Not Shortlisted" },
];

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const StatusPill = memo(function StatusPill({ status }) {
  const s = STATUS[status] || { label: status, color: "bg-surface-alt text-ink-muted", dot: "bg-ink-faint" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
});

const TimelineItem = memo(function TimelineItem({ done, active, warning, label, time }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        done    ? "bg-emerald-500" :
        active  ? "bg-accent animate-pulse" :
        warning ? "bg-amber-400" :
        "bg-default"
      }`}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium ${done || active ? "text-ink" : "text-ink-faint"}`}>{label}</p>
        {time && <p className="text-xs text-ink-faint mt-0.5">{time}</p>}
      </div>
    </div>
  );
});

const FeedbackPreview = memo(function FeedbackPreview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 120;
  const isLong  = text.length > LIMIT;
  const display = expanded || !isLong ? text : text.slice(0, LIMIT) + "...";
  const toggle  = useCallback(() => setExpanded((p) => !p), []);
  return (
    <div className="bg-white rounded-xl p-4 border border-default">
      <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">💬 Referrer Feedback</p>
      <p className="text-sm text-ink-muted leading-relaxed">{display}</p>
      {isLong && (
        <button onClick={toggle} className="text-xs text-accent font-medium mt-2 hover:underline">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
});

const ApplicationRow = memo(function ApplicationRow({ app, isExpanded, onToggle }) {
  const s      = STATUS[app.status] || STATUS.APPLIED;
  const date   = new Date(app.createdAt);
  const short  = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const full   = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const initials = useMemo(() =>
    (app.companyId?.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    [app.companyId?.name]
  );
  const hasComment = app.rejectionReason?.trim().length > 0;

  return (
    <>
      <div
        className={`grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_160px_120px_80px] items-center gap-3 px-5 py-4 hover:bg-surface-alt/40 transition-colors cursor-pointer border-b border-default last:border-0 ${isExpanded ? "bg-accent-soft/10" : ""}`}
        onClick={onToggle}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center font-display font-bold text-accent text-xs flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-ink text-sm truncate">{app.companyId?.name || "—"}</p>
          <p className="text-xs text-ink-muted truncate mt-0.5">{app.jobTitle || app.jobId || "Role not specified"}</p>
        </div>
        <div className="hidden md:block"><StatusPill status={app.status} /></div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-ink-muted" title={full}>{short}</p>
          {app.forwardedCount > 0 && <p className="text-xs text-amber-600 font-medium mt-0.5">↗ {app.forwardedCount}× fwd</p>}
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
          <svg className={`w-4 h-4 text-ink-faint transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-b border-default bg-surface-alt/30">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <StatusPill status={app.status} />
            <p className="text-xs text-ink-muted">{full}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-default">
                  <p className="text-xs text-ink-faint mb-1">Job Title</p>
                  <p className="text-sm font-medium text-ink">{app.jobTitle || "—"}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-default">
                  <p className="text-xs text-ink-faint mb-1">Job ID</p>
                  <p className="text-sm font-medium text-ink font-mono">{app.jobId || "—"}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-default">
                  <p className="text-xs text-ink-faint mb-1">Applied</p>
                  <p className="text-sm font-medium text-ink">{full}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-default">
                  <p className="text-xs text-ink-faint mb-1">Forwarded</p>
                  <p className="text-sm font-medium text-ink">{app.forwardedCount > 0 ? `${app.forwardedCount}×` : "Not forwarded"}</p>
                </div>
              </div>
              {hasComment && <FeedbackPreview text={app.rejectionReason} />}
              {app.jobUrl && (
                <a href={app.jobUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium">
                  🔗 View Job Posting →
                </a>
              )}
            </div>
            <div className="bg-white rounded-xl p-4 border border-default">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">Timeline</p>
              <div className="space-y-3">
                <TimelineItem done label="Application submitted" time={timeAgo(app.createdAt)} />
                <TimelineItem
                  done={["APPLIED","REFERRED","NOT_SHORTLISTED","FORWARDED"].includes(app.status)}
                  label="Assigned to referrer"
                  time={app.status !== "NO_REFERRER_AVAILABLE" ? "Automatic" : null}
                />
                {app.forwardedCount > 0 && <TimelineItem done warning label={`Forwarded ${app.forwardedCount}×`} time="Auto-forwarded" />}
                <TimelineItem
                  done={app.status === "REFERRED"}
                  active={["APPLIED","FORWARDED"].includes(app.status)}
                  label="Referral submitted"
                  time={app.status === "REFERRED" ? timeAgo(app.updatedAt) : null}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

const SkeletonRow = memo(function SkeletonRow() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 border-b border-default last:border-0">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
});

export default function MyApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page         = parseInt(searchParams.get("page") || "1");
  const statusFilter = searchParams.get("status") || "";
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useGetSeekerApplicationsQuery({ page, limit: 10 });
  const { applications = [], pagination } = data || {};

  const setPage   = useCallback((p) => setSearchParams((prev) => { prev.set("page", p); return prev; }), [setSearchParams]);
  const setFilter = useCallback((s) => setSearchParams((prev) => { s ? prev.set("status", s) : prev.delete("status"); prev.set("page", "1"); return prev; }), [setSearchParams]);
  const handleToggle = useCallback((id) => setExpandedId((prev) => prev === id ? null : id), []);

  const filtered = useMemo(() =>
    statusFilter ? applications.filter((a) => a.status === statusFilter) : applications,
    [applications, statusFilter]
  );

  const stats = useMemo(() => ({
    total:    pagination?.total || 0,
    referred: applications.filter((a) => a.status === "REFERRED").length,
    active:   applications.filter((a) => ["APPLIED","FORWARDED"].includes(a.status)).length,
    declined: applications.filter((a) => a.status === "NOT_SHORTLISTED").length,
  }), [applications, pagination]);

  return (
    <div className="space-y-6 fade-in ">
      <div className="flex items-center justify-between">
        <PageHeader title="My Applications" subtitle="Track every referral request you've submitted" />
        <Link to="/find-referrals" className="flex-shrink-0 text-sm font-medium px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors shadow-sm">
          + New Application
        </Link>
      </div>

      {!isLoading && applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total",    value: stats.total,    color: "text-ink" },
            { label: "Active",   value: stats.active,   color: "text-accent" },
            { label: "Referred", value: stats.referred, color: "text-emerald-600" },
            { label: "Declined", value: stats.declined, color: "text-rose-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-default p-4">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-faint mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === f.value
                ? "bg-accent text-white shadow-sm"
                : "bg-white border border-default text-ink-muted hover:text-ink hover:border-accent/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[auto_1fr_160px_120px_80px] gap-3 px-5 py-3 bg-surface-alt/60 border-b border-default">
          <div className="w-9" />
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Company / Role</p>
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Status</p>
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider text-right">Applied</p>
          <div />
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : filtered.length === 0
          ? (
            <EmptyState
              icon="📋"
              title={statusFilter ? "No applications with this status" : "No applications yet"}
              description={statusFilter ? "Try a different filter" : "Browse companies and apply for a referral"}
              action={!statusFilter && (
                <Link to="/find-referrals" className="mt-4 inline-block text-sm font-medium px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors">
                  Browse Companies →
                </Link>
              )}
            />
          ) : filtered.map((app) => (
            <ApplicationRow
              key={app._id}
              app={app}
              isExpanded={expandedId === app._id}
              onToggle={() => handleToggle(app._id)}
            />
          ))
        }

        {pagination?.pages > 1 && (
          <div className="px-5 py-3 border-t border-default">
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}
