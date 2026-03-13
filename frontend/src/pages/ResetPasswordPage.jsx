import { useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui/index.jsx";
import toast from "react-hot-toast";

function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ characters", pass: password.length >= 6 },
    { label: "Number",        pass: /\d/.test(password) },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  return (
    <div className="flex gap-1 mt-1">
      {[0,1,2].map((i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score-1] : "bg-default"}`} />
      ))}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [form,    setForm]    = useState({ password: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!token) { toast.error("Invalid reset link"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset! Please sign in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  }, [form, token, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-ink font-semibold mb-2">Invalid reset link</p>
          <Link to="/forgot-password" className="text-accent hover:underline text-sm">Request a new one →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto mx-auto" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-6 mb-2">Reset your password</h1>
          <p className="text-sm text-ink-muted">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-default p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Input label="New Password" name="password" type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} error={errors.password} />
              {form.password.length > 0 && <PasswordStrength password={form.password} />}
            </div>
            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat new password"
              value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
