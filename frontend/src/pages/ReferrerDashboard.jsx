import { useState, useMemo, useCallback, memo } from "react";
import { resumeDownloadUrl } from "../utils/resumeUrl.js";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { useGetReferrerApplicationsQuery, useUpdateApplicationStatusMutation } from "../features/seeker/applicationApi.js";
import { useGetReferrerProfileQuery, useToggleAvailabilityMutation } from "../features/referrer/referrerApi.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Modal, Button, Textarea, Card, PageHeader, EmptyState, Pagination } from "../components/ui/index.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import toast from "react-hot-toast";

const ApplicationDetailModal = memo(function ApplicationDetailModal({ application, isOpen, onClose }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [updateStatus, { isLoading }] = useUpdateApplicationStatusMutation();

  const handleReasonChange = useCallback((e) => setRejectionReason(e.target.value), []);

  const handleAction = useCallback(async (status) => {
    try {
      await updateStatus({ id: application._id, status, rejectionReason }).unwrap();
      toast.success(status === "REFERRED" ? "Candidate referred ✓" : "Marked as not shortlisted");
      onClose();
      setRejectionReason("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update");
    }
  }, [application?._id, rejectionReason, updateStatus, onClose]);

  if (!application) return null;
  const seeker = application.seekerId;

 

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Application" size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-display font-bold flex-shrink-0">
            {seeker?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{seeker?.name}</p>
            <p className="text-xs text-ink-faint">{seeker?.email}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-ink-faint mb-1">Job Title</p>
            <p className="text-sm font-semibold text-ink">{application.jobTitle || "—"}</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-ink-faint mb-1">Job ID</p>
            <p className="text-sm font-semibold text-ink font-mono">{application.jobId || "—"}</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-ink-faint mb-1">Experience</p>
            <p className="text-sm font-semibold text-ink">{seeker?.experience ?? 0} yrs</p>
          </div>
          <div className="bg-surface-alt rounded-xl p-3">
            <p className="text-xs text-ink-faint mb-1">Notice Period</p>
            <p className="text-sm font-semibold text-ink">{application.noticePeriod || "—"}</p>
          </div>
        </div>

        {application.jobUrl && (
          <a href={application.jobUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium">
            🔗 View Job Posting →
          </a>
        )}

        {seeker?.bio && (
          <div className="bg-surface-alt rounded-xl p-4">
            <p className="text-xs text-ink-faint mb-2">Bio</p>
            <p className="text-sm text-ink leading-relaxed">{seeker.bio}</p>
          </div>
        )}

        {seeker?.skills?.length > 0 && (
          <div>
            <p className="text-xs text-ink-faint mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {seeker.skills.map((s) => (
                <span key={s} className="bg-accent-soft text-accent text-xs px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-ink-faint mb-2">Why they're a good fit</p>
          <div className="bg-surface-alt rounded-xl p-4">
            <p className="text-sm text-ink leading-relaxed break-words whitespace-pre-wrap">{application.message}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {seeker?.resumeUrl && (
            <a href={resumeDownloadUrl(seeker.resumeUrl, seeker.name)} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[120px] text-center text-sm font-medium text-ink bg-surface-alt border border-default px-4 py-2.5 rounded-xl hover:bg-border transition-colors">
              📄 Resume
            </a>
          )}
          {seeker?.linkedIn && (
            <a href={seeker.linkedIn} target="_blank" rel="noreferrer"
              className="flex-1 min-w-[120px] text-center text-sm font-medium text-accent bg-accent-soft px-4 py-2.5 rounded-xl hover:bg-accent hover:text-white transition-colors">
              LinkedIn →
            </a>
          )}
        </div>

        {["APPLIED", "FORWARDED"].includes(application.status) && (
          <div className="border-t border-default pt-5 space-y-4">
            <Textarea
              label="Add a note (optional)"
              value={rejectionReason}
              onChange={handleReasonChange}
              placeholder="Reason for decision, feedback for the candidate..."
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="danger" disabled={isLoading} onClick={() => handleAction("NOT_SHORTLISTED")} className="w-full">
                ✗ Decline
              </Button>
              <Button variant="success" disabled={isLoading} onClick={() => handleAction("REFERRED")} className="w-full">
                ✓ Refer
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

const ApplicationRow = memo(function ApplicationRow({ app, onSelect }) {
  const date = useMemo(() =>
    new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    [app.createdAt]
  );
  return (
    <tr className="hover:bg-surface-alt/50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-ink">{app.seekerId?.name}</p>
          <p className="text-xs text-ink-faint">{app.seekerId?.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-ink-muted text-xs">
        <p className="font-medium">{app.jobTitle || "—"}</p>
        {app.jobId && <p className="font-mono text-ink-faint">{app.jobId}</p>}
      </td>
      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
      <td className="px-4 py-3 text-ink-faint text-xs whitespace-nowrap">{date}</td>
      <td className="px-4 py-3">
        <button onClick={() => onSelect(app)} className="text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-colors">
          Review →
        </button>
      </td>
    </tr>
  );
});



export default function ReferrerDashboard() {
  const user = useSelector(selectCurrentUser);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data: profileData } = useGetReferrerProfileQuery();
  const [toggleAvailability, { isLoading: toggling }] = useToggleAvailabilityMutation();
  const { data, isLoading } = useGetReferrerApplicationsQuery({ page, limit: 10 });

  const profile = profileData?.profile;
  const { applications = [], pagination } = data || {};

  const handleClose = useCallback(() => setSelected(null), []);
  const handlePageChange = useCallback((p) => setPage(p), []);

  const handleToggle = useCallback(async () => {
    try {
      await toggleAvailability().unwrap();
      toast.success(profile?.isActive ? "You're now unavailable" : "You're now available");
    } catch {
      toast.error("Failed to toggle availability");
    }
  }, [toggleAvailability, profile?.isActive]);

  const stats = useMemo(() => ({
    total:   pagination?.total ?? 0,
    pending: applications.filter((a) => ["APPLIED", "FORWARDED"].includes(a.status)).length,
    referred: applications.filter((a) => a.status === "REFERRED").length,
  }), [applications, pagination]);

  const companyName = useMemo(() =>
    profile?.companyId?.name || user?.currentCompanyId?.name || "Your company",
    [profile?.companyId?.name, user?.currentCompanyId?.name]
  );

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Referrer Dashboard"
        subtitle={`Managing referrals for ${companyName}`}
        action={
          profile && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                profile.isActive
                  ? "bg-emerald-soft border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${profile.isActive ? "bg-emerald-500" : "bg-rose-400"}`} />
              {toggling ? "..." : profile.isActive ? "Available" : "Unavailable"}
            </button>
          )
        }
      />

      {profile && !profile.isActive && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-rose-500 flex-shrink-0">⏸</span>
          <p className="text-sm text-rose-700">
            You're unavailable — no new applications will be assigned to you. Toggle above to resume.
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total",    value: stats.total,    color: "text-ink"          },
            { label: "Pending",  value: stats.pending,  color: "text-amber-600"    },
            { label: "Referred", value: stats.referred, color: "text-emerald-600"  },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-faint mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState icon="📬" title="No applications yet" description="Applications for your company will appear here once seekers apply" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-default">
                    {["Candidate", "Role", "Status", "Applied", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-faint uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {applications.map((app) => (
                    <ApplicationRow key={app._id} app={app} onSelect={setSelected} />
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <div className="px-4 py-3 border-t border-default">
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </Card>

      <ApplicationDetailModal application={selected} isOpen={!!selected} onClose={handleClose} />
    </div>
  );
}