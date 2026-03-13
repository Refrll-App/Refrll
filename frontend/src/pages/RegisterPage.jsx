import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../features/auth/authApi.js";
import { Input, Button } from "../components/ui/index.jsx";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm]   = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreed) e.agreed = "You must accept the Terms & Conditions to continue";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password }).unwrap();
      setRegistered(true);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto mx-auto" /></Link>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-default p-8 text-center space-y-4">
            <div className="text-5xl">📧</div>
            <h2 className="font-display text-xl font-bold text-ink">Check your email</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              We've sent a verification link to <strong>{form.email}</strong>.<br />
              Click the link to activate your account.
            </p>
            <div className="bg-surface-alt rounded-xl p-4 text-xs text-ink-muted text-left space-y-1.5">
              <p>✉️ Check your spam/junk folder if you don't see it</p>
              <p>⏱️ The link expires in 24 hours</p>
            </div>
            <Link to="/login" className="inline-block text-sm text-accent hover:underline font-medium">
              ← Back to sign in
            </Link>
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
          <h1 className="font-display text-2xl font-bold text-ink mt-6 mb-2">Create your account</h1>
          <p className="text-sm text-ink-muted">Join thousands getting hired through referrals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-default p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full Name" name="name" placeholder="Alex Johnson"
              value={form.name} onChange={handleChange} error={errors.name} />
            <Input label="Email" name="email" type="email" placeholder="you@company.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} error={errors.password} />

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <PasswordStrength password={form.password} />
            )}

            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password"
              value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            {/* T&C checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5" onClick={() => { setAgreed((p) => !p); setErrors((p) => ({...p, agreed: ""})); }}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${agreed ? "bg-accent border-accent" : "border-default group-hover:border-accent/50"}`}>
                    {agreed && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <span className="text-xs text-ink-muted leading-relaxed">
                  I agree to Refrll's{" "}
                  <Link to="/terms" target="_blank" className="text-accent hover:underline font-medium">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy" target="_blank" className="text-accent hover:underline font-medium">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-rose-500 ml-7">{errors.agreed}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Contains a number",      pass: /\d/.test(password) },
    { label: "Contains uppercase",     pass: /[A-Z]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const labels = ["Weak", "Fair", "Strong"];
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0,1,2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : "bg-default"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span key={c.label} className={`text-xs ${c.pass ? "text-emerald-600" : "text-ink-faint"}`}>
              {c.pass ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-xs font-medium ${["text-rose-500","text-amber-500","text-emerald-600"][score-1]}`}>{labels[score-1]}</span>}
      </div>
    </div>
  );
}
