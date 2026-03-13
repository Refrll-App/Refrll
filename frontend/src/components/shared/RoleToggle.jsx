import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice.js";
import { useSwitchRoleModeMutation } from "../../features/profile/userApi.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RoleToggle({ compact = false }) {
  const user = useSelector(selectCurrentUser);
  const [switchRole, { isLoading }] = useSwitchRoleModeMutation();
  const navigate = useNavigate();

  const isReferrer = user?.roleMode === "referrer";
  const hasCompany = !!user?.currentCompanyId;

  const handleToggle = async () => {
    if (!hasCompany && !isReferrer) {
      toast(
        (t) => (
          <div className="flex items-start gap-3">
            <span className="text-lg">🏢</span>
            <div>
              <p className="font-semibold text-sm text-ink">Company required</p>
              <p className="text-xs text-ink-muted mt-0.5">Add your current company in Profile to switch to Referrer mode.</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/profile");
                }}
                className="mt-2 text-xs font-medium text-accent hover:underline"
              >
                Go to Profile →
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
      return;
    }

    try {
      const newMode = isReferrer ? "seeker" : "referrer";
      await switchRole({ roleMode: newMode }).unwrap();
      toast.success(
        newMode === "referrer"
          ? "Referrer mode on — you can now review applications"
          : "Seeker mode on — browse companies and apply"
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to switch mode");
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-60 ${
          isReferrer
            ? "bg-emerald-soft text-emerald-700 border border-emerald-200"
            : "bg-accent-soft text-accent border border-accent/20"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isReferrer ? "bg-emerald-500" : "bg-accent"}`} />
        {isLoading ? "..." : isReferrer ? "Referrer" : "Seeker"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all disabled:opacity-60 border ${
        isReferrer
          ? "bg-emerald-soft border-emerald-200 hover:bg-emerald-100"
          : "bg-surface-alt border-default hover:bg-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isReferrer ? "bg-emerald-500" : "bg-accent"}`} />
        <div className="text-left">
          <p className={`text-xs font-semibold ${isReferrer ? "text-emerald-700" : "text-ink"}`}>
            {isLoading ? "Switching..." : isReferrer ? "Referrer Mode" : "Seeker Mode"}
          </p>
          <p className="text-xs text-ink-faint">
            {isReferrer ? "Tap to switch to Seeker" : "Tap to switch to Referrer"}
          </p>
        </div>
      </div>
      {/* Toggle switch visual */}
      <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isReferrer ? "bg-emerald-500" : "bg-ink-faint"}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isReferrer ? "translate-x-4" : "translate-x-0"}`} />
      </div>
    </button>
  );
}
