import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.ok ? setStatus("success") : setStatus("error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-2xl shadow-card border border-default p-10">
          {status === "verifying" && (
            <>
              <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
              <p className="font-display text-lg font-bold text-ink">Verifying...</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="text-5xl mb-4">✅</div>
              <p className="font-display text-xl font-bold text-ink mb-2">Email verified!</p>
              <p className="text-sm text-ink-muted mb-6">Your account is now fully active.</p>
              <Link to="/dashboard" className="inline-block bg-accent text-white font-medium px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-colors">
                Go to Dashboard →
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="text-5xl mb-4">❌</div>
              <p className="font-display text-xl font-bold text-ink mb-2">Link expired</p>
              <p className="text-sm text-ink-muted mb-6">This verification link is invalid or has expired.</p>
              <Link to="/dashboard" className="inline-block bg-accent text-white font-medium px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-colors">
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
        <Link to="/" className="mt-6 inline-block text-sm text-ink-faint hover:text-ink transition-colors">
          ← Back to Refrll
        </Link>
      </div>
    </div>
  );
}
