import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice.js";
import { useLogoutMutation } from "../../features/auth/authApi.js";
import RoleToggle from "../shared/RoleToggle.jsx";
import NotificationBell from "../shared/NotificationBell.jsx";
import toast from "react-hot-toast";

const SEEKER_NAV = [
  { to: "/dashboard",       icon: "⚡", label: "Dashboard" },
  { to: "/find-referrals",  icon: "🎯", label: "Find Referrals" },
  { to: "/my-applications", icon: "📋", label: "My Applications" },
  { to: "/leaderboard",     icon: "🏆", label: "Leaderboard" },
  { to: "/profile",         icon: "👤", label: "Profile" },
];

const REFERRER_NAV = [
  { to: "/dashboard",   icon: "⚡", label: "Dashboard" },
  { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  { to: "/profile",     icon: "👤", label: "Profile" },
];

const SideNavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive ? "bg-accent-soft text-accent" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
      }`
    }
  >
    <span className="text-base">{icon}</span>
    {label}
  </NavLink>
);

const BottomTabItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative text-xs font-medium transition-all ${
        isActive ? "text-accent" : "text-ink-faint"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`text-xl leading-none mb-0.5 transition-transform ${isActive ? "scale-110" : ""}`}>{icon}</span>
        <span>{label}</span>
        {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />}
      </>
    )}
  </NavLink>
);

function EmailVerificationBanner({ user }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || user.isEmailVerified) return null;

  const resend = async () => {
    setSending(true);
    try {
      const token = window.__accessToken;
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "include",
        headers: { authorization: `Bearer ${token}` },
      });
      setSent(true);
      toast.success("Verification email sent!");
    } catch {
      toast.error("Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-soft border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <span className="text-amber-800 font-medium">Please verify your email to unlock all features.</span>
      </div>
      {!sent ? (
        <button
          onClick={resend}
          disabled={sending}
          className="text-xs font-semibold text-amber-800 border border-amber-300 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {sending ? "Sending..." : "Resend"}
        </button>
      ) : (
        <span className="text-xs text-amber-700">✓ Sent!</span>
      )}
    </div>
  );
}

function MobileDrawer({ isOpen, onClose, user, onLogout, NAV_ITEMS }) {
  const isReferrer = user?.roleMode === "referrer";
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-white shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-default">
          <img src="/logo.png" alt="Refrll" className="h-8 w-auto" />
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-alt text-ink-muted text-xl">×</button>
        </div>

        <div className="p-5 border-b border-default">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center text-accent font-display font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink truncate">{user?.name}</p>
              <p className="text-xs text-ink-faint truncate">{user?.email}</p>
              {!user?.isEmailVerified && <span className="text-xs text-amber-600 font-medium">⚠️ Unverified</span>}
            </div>
          </div>
        </div>

        <div className="p-5 border-b border-default space-y-3">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Your Mode</p>
          <div className="bg-surface-alt rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{isReferrer ? "Referrer" : "Seeker"}</p>
                <p className="text-xs text-ink-muted">{isReferrer ? "Reviewing applicants" : "Browsing & applying"}</p>
              </div>
              <RoleToggle compact />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {NAV_ITEMS?.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-accent-soft text-accent" : "text-ink-muted hover:bg-surface-alt hover:text-ink"}`
              }
            >
              <span className="text-base">{icon}</span>{label}
            </NavLink>
          ))}
          {user?.isAdmin && (
            <NavLink to="/admin" onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-accent-soft text-accent" : "text-ink-muted hover:bg-surface-alt hover:text-ink"}`
              }
            >
              <span>🛡️</span> Admin
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-default">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
            <span>🚪</span> Sign out
          </button>
        </div>
      </div>
    </>
  );
}

export default function AppLayout() {
  const user = useSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const NAV_ITEMS = user?.roleMode === "referrer" ? REFERRER_NAV : SEEKER_NAV;

  const handleLogout = async () => {
    try {
      setDrawerOpen(false);
      await logout().unwrap();
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const pageTitle = { "/profile": "Profile", "/admin": "Admin", "/leaderboard": "Leaderboard" }[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-default bg-white fixed h-full z-20">
        <div className="p-4 border-b border-default">
          <img src="/logo.png" alt="Refrll" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS?.map(({ to, icon, label }) => <SideNavItem key={to} to={to} icon={icon} label={label} />)}
          {user?.isAdmin && <SideNavItem to="/admin" icon="🛡️" label="Admin" />}
        </nav>

        <div className="p-4 border-t border-default space-y-3">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider px-1">Mode</span>
            <RoleToggle />
            {!user?.currentCompanyId && user?.roleMode !== "referrer" && (
              <p className="text-xs text-ink-faint px-1 leading-relaxed">💡 Add your company in Profile to enable Referrer mode.</p>
            )}
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-alt">
            <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent font-display font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
              <p className="text-xs text-ink-faint truncate">{user?.email}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-ink-muted hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Email verification banner */}
        <EmailVerificationBanner user={user} />

        {/* Mobile top header */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-default px-4 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Refrll" className="h-7 w-auto" />
            <span className="text-ink-faint text-sm">/ {pageTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user?.roleMode === "referrer" ? "bg-emerald-soft text-emerald-700" : "bg-accent-soft text-accent"}`}>
              {user?.roleMode === "referrer" ? "Referrer" : "Seeker"}
            </span>
            <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-surface-alt transition-colors" aria-label="Open menu">
              <span className="w-5 h-0.5 bg-ink rounded-full" />
              <span className="w-5 h-0.5 bg-ink rounded-full" />
              <span className="w-3 h-0.5 bg-ink rounded-full self-start ml-1" />
            </button>
          </div>
        </header>

        {/* Desktop notification bar */}
        <div className="hidden md:flex justify-end px-8 pt-4">
          <NotificationBell />
        </div>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-default">
        <div className="flex items-stretch">
          <BottomTabItem to="/dashboard"   icon="⚡" label="Home" />
          {user?.roleMode !== "referrer" && <BottomTabItem to="/find-referrals"  icon="🎯" label="Find" />}
          {user?.roleMode !== "referrer" && <BottomTabItem to="/my-applications" icon="📋" label="Applied" />}
          <BottomTabItem to="/leaderboard" icon="🏆" label="Leaders" />
          <BottomTabItem to="/profile"     icon="👤" label="Profile" />
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-xs font-medium text-ink-faint hover:text-ink transition-colors"
          >
            <span className="text-xl leading-none mb-0.5">☰</span>
            <span>More</span>
          </button>
        </div>
      </nav>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} onLogout={handleLogout} NAV_ITEMS={NAV_ITEMS} />
    </div>
  );
}
