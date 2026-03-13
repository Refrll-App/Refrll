import { useState, useMemo, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { useGetLeaderboardQuery } from "../features/leaderboard/leaderboardApi.js";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Card } from "../components/ui/index.jsx";
import toast from "react-hot-toast";

const PERIODS = [
  { value: "month",   label: "This Month" },
  { value: "week",    label: "This Week"  },
  { value: "alltime", label: "All Time"   },
];
const MEDALS = ["🥇", "🥈", "🥉"];
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

const getLinkedInShareUrl = (userId) => {
  const badgeUrl = encodeURIComponent(`${PUBLIC_URL}/badge/${userId}`);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${badgeUrl}`;
};

const ShareBadgeModal = memo(function ShareBadgeModal({ referrer, rank, onClose }) {
  const badgeText = useMemo(() =>
    `🏆 Ranked #${rank} on Refrll this month!\n✅ ${referrer.referred} referrals · ${referrer.referralRate}% success rate\n🤝 Helping professionals land jobs at ${referrer.companyName}\nJoin Refrll → ${window.location.origin}`,
    [rank, referrer]
  );

  const shareToLinkedIn = useCallback(() => {
    window.open(getLinkedInShareUrl(referrer._id), "_blank", "noopener,noreferrer,width=600,height=600");
  }, [referrer._id]);

  const shareToTwitter = useCallback(() => {
    const text = encodeURIComponent(`🏆 Ranked #${rank} on @Refrll this month!\n✅ ${referrer.referred} referrals · ${referrer.referralRate}% success rate`);
    const url  = encodeURIComponent(`${window.location.origin}/leaderboard`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer,width=600,height=400");
  }, [rank, referrer]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(badgeText)
      .then(() => toast.success("Badge text copied!"))
      .catch(() => toast.error("Copy failed — please copy manually"));
  }, [badgeText]);

  const shareNative = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: `${referrer.name} — Refrll Top Referrer`, text: badgeText, url: `${window.location.origin}/leaderboard` }).catch(() => {});
    } else {
      copyToClipboard();
    }
  }, [referrer.name, badgeText, copyToClipboard]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-accent to-accent-hover p-6 text-white text-center">
          <div className="text-4xl mb-2">{MEDALS[rank - 1] || "🏅"}</div>
          <p className="font-display text-xl font-bold">{referrer.name}</p>
          <p className="text-white/80 text-sm mt-0.5">{referrer.companyName}</p>
          <div className="flex justify-center gap-6 mt-4">
            {[
              { value: referrer.referred,      label: "Referrals"    },
              { value: `${referrer.referralRate}%`, label: "Success Rate" },
              { value: `#${rank}`,             label: "Rank"         },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="text-white/70 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-3">refrll.com</p>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm font-semibold text-ink text-center">Share your achievement</p>
          <button onClick={shareToLinkedIn} className="w-full flex items-center justify-center gap-2.5 bg-[#0A66C2] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#004182] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </button>
          <button onClick={shareToTwitter} className="w-full flex items-center justify-center gap-2.5 bg-black text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.734l7.736-8.857L2.018 2.25H8.08l4.264 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            Share on X (Twitter)
          </button>
          <button onClick={shareNative} className="w-full flex items-center justify-center gap-2 bg-surface-alt border border-default text-ink text-sm font-medium py-2.5 rounded-xl hover:bg-border transition-colors">
            📋 Copy Badge Text
          </button>
          <button onClick={onClose} className="w-full text-sm text-ink-faint hover:text-ink transition-colors py-1">Close</button>
          <p className="text-xs text-ink-faint text-center leading-relaxed">LinkedIn will show a preview card when you post the link</p>
        </div>
      </div>
    </div>
  );
});

const LeaderboardRow = memo(function LeaderboardRow({ r, rank, isMe, onShare }) {
  return (
    <div className={`px-4 py-3.5 flex items-center gap-3 transition-colors ${isMe ? "bg-accent-soft/30" : "hover:bg-surface-alt/30"}`}>
      <div className="w-8 text-center flex-shrink-0">
        {rank <= 3
          ? <span className="text-xl">{MEDALS[rank - 1]}</span>
          : <span className="text-sm font-bold text-ink-faint">#{rank}</span>
        }
      </div>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0 ${isMe ? "bg-accent text-white" : r.isAnonymous ? "bg-surface-alt text-ink-faint" : "bg-accent-soft text-accent"}`}>
        {r.isAnonymous ? "🔒" : r.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`font-semibold text-sm truncate ${r.isAnonymous ? "text-ink-muted italic" : "text-ink"}`}>{r.name}</p>
          {isMe && <span className="text-xs text-accent font-medium">(you)</span>}
          {r.isAnonymous && !isMe && <span className="text-xs text-ink-faint">· anonymous</span>}
        </div>
        <p className="text-xs text-ink-faint truncate">{r.companyName}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-center hidden sm:block">
          <p className="text-sm font-bold text-ink">{r.total}</p>
          <p className="text-xs text-ink-faint">handled</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-700">{r.referred}</p>
          <p className="text-xs text-ink-faint">referred</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-sm font-bold text-accent">{r.referralRate}%</p>
          <p className="text-xs text-ink-faint">rate</p>
        </div>
        {isMe && (
          <button onClick={onShare} className="text-xs text-ink-faint hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-accent-soft" title="Share badge">
            🔗
          </button>
        )}
      </div>
    </div>
  );
});

export default function LeaderboardPage() {
  const user = useSelector(selectCurrentUser);
  const [period,      setPeriod]      = useState("month");
  const [companyId,   setCompanyId]   = useState("");
  const [shareTarget, setShareTarget] = useState(null);

  const { data, isLoading } = useGetLeaderboardQuery({ period, companyId });
  const { leaderboard = [], companies = [] } = data || {};

  const myRank  = useMemo(() => user ? leaderboard.findIndex((r) => r._id === user._id) + 1 : 0, [leaderboard, user]);
  const myEntry = useMemo(() => myRank > 0 ? leaderboard[myRank - 1] : null, [leaderboard, myRank]);

  const handlePeriod    = useCallback((v) => setPeriod(v),    []);
  const handleCompany   = useCallback((e) => setCompanyId(e.target.value), []);
  const handleCloseShare = useCallback(() => setShareTarget(null), []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-default sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-display font-bold text-ink text-lg">Refrll Leaderboard</span>
          </div>
          {user && <a href="/dashboard" className="text-sm text-accent hover:underline">← Dashboard</a>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {myEntry && (
          <div className="bg-gradient-to-r from-accent to-accent-hover rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-display font-bold text-white text-lg">
                #{myRank}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Your Ranking</p>
                <p className="text-white/80 text-xs">{myEntry.referred} referrals · {myEntry.referralRate}% rate</p>
              </div>
            </div>
            <button
              onClick={() => setShareTarget({ referrer: myEntry, rank: myRank })}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              🔗 Share Badge
            </button>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-1 bg-surface-alt p-1 rounded-xl">
            {PERIODS.map(({ value, label }) => (
              <button key={value} onClick={() => handlePeriod(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === value ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}>
                {label}
              </button>
            ))}
          </div>
          {companies.length > 0 && (
            <select value={companyId} onChange={handleCompany}
              className="px-3 py-1.5 rounded-xl border border-default bg-white text-xs text-ink focus:outline-none focus:border-accent">
              <option value="">All Companies</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
        </div>

        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
                  <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
                  <Skeleton className="h-8 w-16 rounded-xl" />
                </div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3">📊</p>
              <p className="font-semibold text-ink">No data yet</p>
              <p className="text-sm text-ink-faint mt-1">Referrals made this period will appear here</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-default bg-surface-alt/50">
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Top {leaderboard.length} Referrers</p>
              </div>
              <div className="divide-y divide-default">
                {leaderboard.map((r, i) => {
                  const rank = i + 1;
                  const isMe = Boolean(user && r._id === user._id);
                  return (
                    <LeaderboardRow
                      key={r._id}
                      r={r}
                      rank={rank}
                      isMe={isMe}
                      onShare={() => setShareTarget({ referrer: r, rank })}
                    />
                  );
                })}
              </div>
            </>
          )}
        </Card>

        <p className="text-xs text-ink-faint text-center pb-4">
          Rankings update in real time · Only referrers with activity are shown
        </p>
      </div>

      {shareTarget && (
        <ShareBadgeModal referrer={shareTarget.referrer} rank={shareTarget.rank} onClose={handleCloseShare} />
      )}
    </div>
  );
}
