import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "refrll_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-ink text-white rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1">🍪 We use cookies</p>
          <p className="text-xs text-white/70 leading-relaxed">
            We use essential cookies to keep you logged in and optional analytics cookies to improve the platform.{" "}
            <Link to="/cookies" className="text-accent-soft underline hover:no-underline">Cookie Policy</Link>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs font-medium text-white/70 hover:text-white px-3 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-xs font-semibold bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
