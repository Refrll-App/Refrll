import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/ui/index.jsx";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setSent(true);
      else toast.error(data.message || "Something went wrong");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  }, [email]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto mx-auto" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-6 mb-2">Forgot password?</h1>
          <p className="text-sm text-ink-muted">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-default p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📬</div>
              <p className="font-semibold text-ink">Check your email</p>
              <p className="text-sm text-ink-muted leading-relaxed">
                If an account with <strong>{email}</strong> exists, we've sent a password reset link. It expires in 1 hour.
              </p>
              <p className="text-xs text-ink-faint">Don't see it? Check your spam folder.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                error={error}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          <Link to="/login" className="text-accent font-medium hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
