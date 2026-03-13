import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApi.js";
import { Input, Button } from "../components/ui/index.jsx";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [unverified, setUnverified] = useState(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await login(form).unwrap();
      navigate("/dashboard");
    } catch (err) {
      if (err?.data?.unverified) {
        setUnverified(err.data.email);
      } else {
        toast.error(err?.data?.message || "Sign in failed");
      }
    }
  };

  if (unverified) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto mx-auto" /></Link>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-default p-8 text-center space-y-4">
            <div className="text-4xl">📧</div>
            <h2 className="font-display text-xl font-bold text-ink">Email not verified</h2>
            <p className="text-sm text-ink-muted">You need to verify <strong>{unverified}</strong> before you can sign in.</p>
            <ResendVerificationButton email={unverified} />
            <button onClick={() => setUnverified(null)} className="text-xs text-ink-faint hover:text-ink transition-colors">
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto mx-auto" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-6 mb-2">Welcome back</h1>
          <p className="text-sm text-ink-muted">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-default p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Email" name="email" type="email" placeholder="you@company.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <div className="space-y-1">
              <Input label="Password" name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} error={errors.password} />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

function ResendVerificationButton({ email }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setSent(true); toast.success("Verification email sent!"); }
      else toast.error("Failed to resend. Please try again.");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  if (sent) return <p className="text-sm text-emerald-600 font-medium">✓ Verification email sent — check your inbox</p>;
  return (
    <Button onClick={handleResend} disabled={loading} variant="secondary" className="w-full">
      {loading ? "Sending..." : "Resend verification email"}
    </Button>
  );
}
