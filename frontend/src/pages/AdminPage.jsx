import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { resumeDownloadUrl } from "../utils/resumeUrl.js";
import { useSearchParams } from "react-router-dom";
import {
  useGetAdminUsersQuery,
  useGetAdminApplicationsQuery,
  useGetAdminStatsQuery,
} from "../features/admin/adminApi.js";
import { PageHeader, Card, Badge, Pagination } from "../components/ui/index.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = memo(function StatCard({ label, value, icon, color = "text-ink" }) {
  return (
    <Card className="p-5">
      <span className="text-2xl">{icon}</span>
      <p className={`font-display text-3xl font-bold mt-3 ${color}`}>{value}</p>
      <p className="text-sm text-ink-muted mt-1">{label}</p>
    </Card>
  );
});

// ── Overview Tab ──────────────────────────────────────────────────────────────
const OverviewTab = memo(function OverviewTab({ stats }) {
  if (!stats) return null;
  const { requestsPerCompany, requestsPerReferrer, dailyRequests, funnel } = stats;
  const maxDaily = useMemo(() => Math.max(...(dailyRequests?.map((d) => d.count) || [1]), 1), [dailyRequests]);

  return (
    <div className="space-y-6">
      {funnel && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-default">
            <h3 className="font-display font-bold text-ink">Conversion Funnel</h3>
            <p className="text-xs text-ink-faint mt-0.5">Application flow breakdown</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-default">
            {[
              { label: "Created",  value: funnel.created,        color: "text-ink"         },
              { label: "Assigned", value: funnel.assigned,       color: "text-accent"      },
              { label: "Pending",  value: funnel.pending,        color: "text-amber-600"   },
              { label: "Referred", value: funnel.referred,       color: "text-emerald-600" },
              { label: "Declined", value: funnel.notShortlisted, color: "text-rose-500"    },
            ].map((s) => (
              <div key={s.label} className="p-4 text-center">
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-ink-faint mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requestsPerCompany?.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-default">
              <h3 className="font-display font-bold text-ink text-sm">Top Companies</h3>
            </div>
            <div className="divide-y divide-default">
              {requestsPerCompany.slice(0, 8).map((item, i) => (
                <div key={item._id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-ink-faint w-5 flex-shrink-0">#{i + 1}</span>
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-default rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(item.total / requestsPerCompany[0].total) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-ink w-8 text-right">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {requestsPerReferrer?.length > 0 && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-default">
              <h3 className="font-display font-bold text-ink text-sm">Top Referrers</h3>
            </div>
            <div className="divide-y divide-default">
              {requestsPerReferrer.slice(0, 8).map((item, i) => (
                <div key={item._id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-ink-faint w-5 flex-shrink-0">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                      <p className="text-xs text-ink-faint truncate">{item.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-emerald-600 font-semibold">{item.referred} referred</span>
                    <span className="text-sm font-bold text-ink">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {dailyRequests?.length > 0 && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-ink text-sm mb-4">Daily Applications (Last 30 days)</h3>
          <div className="flex items-end gap-1 h-32">
            {dailyRequests.map((d) => {
              const h = Math.max((d.count / maxDaily) * 100, d.count > 0 ? 8 : 2);
              return (
                <div key={d._id} className="flex-1 flex flex-col justify-end relative group cursor-default">
                  <div className="w-full bg-accent rounded-sm group-hover:bg-accent-hover transition-all" style={{ height: `${h}%`, minHeight: d.count > 0 ? "4px" : "1px" }} />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    {d._id}: {d.count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-ink-faint mt-2">
            <span>{dailyRequests[0]?._id}</span>
            <span>{dailyRequests[dailyRequests.length - 1]?._id}</span>
          </div>
        </Card>
      )}
    </div>
  );
});

// ── User Row ──────────────────────────────────────────────────────────────────
const UserRow = memo(function UserRow({ user }) {
  const date = useMemo(() =>
    new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    [user.createdAt]
  );
  return (
    <tr className="hover:bg-surface-alt/40 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-display font-bold text-xs flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-ink text-sm">{user.name}</p>
              {user.isAdmin && <Badge variant="accent" className="text-xs">admin</Badge>}
              {!user.isEmailVerified && <span className="text-xs text-amber-600 bg-amber-soft px-1.5 py-0.5 rounded-full">unverified</span>}
            </div>
            <p className="text-xs text-ink-faint truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Badge variant={user.roleMode === "referrer" ? "success" : "default"}>
          {user.roleMode}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs text-ink-muted">{user.currentCompanyId?.name || "—"}</p>
      </td>
      <td className="px-4 py-3 text-right">
        <p className="text-xs text-ink-faint">{date}</p>
      </td>
    </tr>
  );
});

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ searchParams, setSearchParams }) {
  const page   = parseInt(searchParams.get("uPage") || "1");
  const role   = searchParams.get("role") || "";
  const search = searchParams.get("uSearch") || "";
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);

  const setPage = useCallback((p) => setSearchParams((prev) => { prev.set("uPage", String(p)); return prev; }), [setSearchParams]);
  const setRole = useCallback((r) => setSearchParams((prev) => { prev.set("role", r); prev.set("uPage", "1"); return prev; }), [setSearchParams]);

  useEffect(() => {
    setSearchParams((prev) => { prev.set("uSearch", debouncedSearch); prev.set("uPage", "1"); return prev; });
  }, [debouncedSearch, setSearchParams]);

  const { data, isLoading } = useGetAdminUsersQuery({ page, limit: 15, role, search: debouncedSearch });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-surface-alt p-1 rounded-xl">
          {[["", "All"], ["seeker", "Seekers"], ["referrer", "Referrers"]].map(([val, label]) => (
            <button key={val} onClick={() => setRole(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${role === val ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search name or email..."
            className="pl-8 pr-3 py-1.5 rounded-xl border border-default bg-white text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent w-52" />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-xs text-ink-faint ml-auto">{data?.pagination?.total ?? 0} users</p>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-surface-alt/50">
                  {["User", "Role", "Company", "Joined"].map((h, i) => (
                    <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-ink-faint uppercase tracking-wider ${i === 1 ? "hidden md:table-cell" : i === 2 ? "hidden lg:table-cell" : i === 3 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-default">
                {(data?.users || []).length === 0
                  ? <tr><td colSpan={4} className="p-8 text-center text-sm text-ink-faint">No users found</td></tr>
                  : (data?.users || []).map((user) => <UserRow key={user._id} user={user} />)
                }
              </tbody>
            </table>
            {data?.pagination && (
              <div className="px-4 py-3 border-t border-default">
                <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Application Row ───────────────────────────────────────────────────────────
const AppRow = memo(function AppRow({ app }) {
  const date = useMemo(() =>
    new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    [app.createdAt]
  );
  return (
    <tr className="hover:bg-surface-alt/40 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-ink text-sm">{app.seekerId?.name || "—"}</p>
          <p className="text-xs text-ink-faint">{app.seekerId?.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-xs font-medium text-ink">{app.companyId?.name || "—"}</p>
        <p className="text-xs text-ink-faint">{app.jobTitle || app.jobId || "—"}</p>
      </td>
      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs text-ink-muted">{app.assignedReferrerId?.name || <span className="text-ink-faint italic">Unassigned</span>}</p>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {app.seekerId?.resumeUrl && (
            <a href={resumeDownloadUrl(app.seekerId.resumeUrl, app.seekerId.name)} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">📄</a>
          )}
          <span className="text-xs text-ink-faint">{date}</span>
        </div>
      </td>
    </tr>
  );
});

// ── Applications Tab ──────────────────────────────────────────────────────────
const STATUSES = ["", "APPLIED", "FORWARDED", "REFERRED", "NOT_SHORTLISTED", "NO_REFERRER_AVAILABLE"];
const STATUS_LABELS = { "": "All", APPLIED: "Applied", FORWARDED: "Forwarded", REFERRED: "Referred", NOT_SHORTLISTED: "Declined", NO_REFERRER_AVAILABLE: "No Referrer" };

function ApplicationsTab({ searchParams, setSearchParams }) {
  const page   = parseInt(searchParams.get("aPage") || "1");
  const status = searchParams.get("status") || "";

  const setPage   = useCallback((p) => setSearchParams((prev) => { prev.set("aPage", String(p)); return prev; }), [setSearchParams]);
  const setStatus = useCallback((s) => setSearchParams((prev) => { prev.set("status", s); prev.set("aPage", "1"); return prev; }), [setSearchParams]);

  const { data, isLoading } = useGetAdminApplicationsQuery({ page, limit: 20, status });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-surface-alt p-1 rounded-xl flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${status === s ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-faint">{data?.pagination?.total ?? 0} applications</p>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-56" /></div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-surface-alt/50">
                  {["Seeker", "Role", "Status", "Referrer", "Date"].map((h, i) => (
                    <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-ink-faint uppercase tracking-wider ${i === 1 ? "hidden md:table-cell" : i === 3 ? "hidden lg:table-cell" : i === 4 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-default">
                {(data?.applications || []).length === 0
                  ? <tr><td colSpan={5} className="p-8 text-center text-sm text-ink-faint">No applications found</td></tr>
                  : (data?.applications || []).map((app) => <AppRow key={app._id} app={app} />)
                }
              </tbody>
            </table>
            {data?.pagination && (
              <div className="px-4 py-3 border-t border-default">
                <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",      label: "Overview",      icon: "📊" },
  { id: "applications",  label: "Applications",  icon: "📋" },
  { id: "users",         label: "Users",         icon: "👥" },
];
const VALID_TABS = TABS.map((t) => t.id);

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = VALID_TABS.includes(searchParams.get("tab")) ? searchParams.get("tab") : "overview";

  const setTab = useCallback((t) => setSearchParams((prev) => {
    prev.set("tab", t);
    ["uPage","role","uSearch","aPage","status"].forEach((k) => prev.delete(k));
    return prev;
  }), [setSearchParams]);

  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="Admin Panel" subtitle="Platform overview and management" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5"><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-4 w-24" /></Card>
            ))
          : [
              { label: "Total Users",  value: stats?.totalUsers ?? 0,    icon: "👥"                             },
              { label: "Seekers",      value: stats?.totalSeekers ?? 0,  icon: "🔍", color: "text-accent"       },
              { label: "Referrers",    value: stats?.totalReferrers ?? 0,icon: "🤝", color: "text-emerald-700"  },
              { label: "Requests",     value: stats?.totalApps ?? 0,     icon: "📋"                             },
            ].map((s) => <StatCard key={s.label} {...s} />)
        }
      </div>

      <div className="flex gap-1 bg-surface-alt p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "overview"     && <OverviewTab stats={stats} />}
      {tab === "applications" && <ApplicationsTab searchParams={searchParams} setSearchParams={setSearchParams} />}
      {tab === "users"        && <UsersTab        searchParams={searchParams} setSearchParams={setSearchParams} />}
    </div>
  );
}