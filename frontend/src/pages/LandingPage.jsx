import { Link } from "react-router-dom";

const STEPS = [
  { n: "01", title: "Create your profile", desc: "Sign up, upload your resume, and tell us about your experience and target roles." },
  { n: "02", title: "Pick a company", desc: "Browse companies with active referrers. Apply with a short note about why you're a great fit." },
  { n: "03", title: "Get matched instantly", desc: "Our smart system assigns your application to a real employee at that company automatically." },
  { n: "04", title: "Hear back in 48h", desc: "Your referrer reviews your profile. If they don't respond in 48h, your request auto-forwards to another." },
];

const FEATURES = [
  { icon: "🎯", title: "Smart Matching", desc: "Applications are balanced across referrers so no one gets overwhelmed. Every request gets fair attention." },
  { icon: "⏱️", title: "48h Auto-Forward", desc: "No ghosting. If a referrer doesn't act within 48 hours, your application automatically goes to the next available one." },
  { icon: "🔒", title: "Verified Referrers", desc: "Every referrer is verified to actually work at their listed company. Real employees, real referrals." },
  { icon: "🏆", title: "Public Leaderboard", desc: "Top referrers are celebrated publicly. A community built on mutual trust and accountability." },
  { icon: "📧", title: "Instant Notifications", desc: "Email and in-app alerts every step of the way. Never wonder what's happening with your application." },
  { icon: "🤝", title: "Two-sided platform", desc: "Seekers get referrals. Referrers build their reputation. A network that benefits everyone." },
];

const TESTIMONIALS = [
  { name: "Priya M.", role: "Software Engineer", company: "Got referred to Stripe", text: "I applied on a Monday, had a referral by Wednesday, and an interview scheduled by Friday. Refrll actually works." },
  { name: "Arjun K.", role: "Referrer at Google", text: "Love being able to help people break into big tech. The dashboard makes reviewing profiles super easy.", company: "Top Referrer — March" },
  { name: "Sneha R.", role: "Product Manager", company: "Got referred to Razorpay", text: "What I love is that even if one referrer can't help, your request automatically moves to someone else. No dead ends." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Nav */}
      <nav className="border-b border-default bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <img src="/logo.png" alt="Refrll" className="h-9 w-auto" />
          <div className="flex items-center gap-3">
            <Link to="/leaderboard" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors hidden sm:block">Leaderboard</Link>
            <Link to="/login" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Sign in</Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors shadow-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent-soft text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            The referral network that actually delivers
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.05] mb-6">
            Get referred.<br />
            <span className="text-accent">Get hired.</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-xl leading-relaxed mb-10">
            Refrll connects ambitious job seekers with real employees who can refer them at top companies. No cold emails. No LinkedIn guesswork. Just a direct path in.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link to="/register" className="px-6 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
              Find a referral →
            </Link>
            <Link to="/register" className="px-6 py-3.5 bg-white text-ink font-semibold rounded-xl border border-default hover:bg-surface-alt transition-all">
              Become a referrer
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink-faint">
            <span className="flex items-center gap-1.5">✓ Free to join</span>
            <span className="flex items-center gap-1.5">✓ Verified referrers only</span>
            <span className="flex items-center gap-1.5">✓ Response in 48h</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-default py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">From signup to referral in days, not months</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-4xl font-display font-bold text-accent/20 mb-3">{s.n}</div>
                <h3 className="font-display font-bold text-ink text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Features</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Built for results, not just connections</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-card border border-default hover:shadow-card-hover transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-default py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Real people, real referrals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-surface rounded-2xl p-6 border border-default">
                <p className="text-sm text-ink-muted leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center text-accent font-display font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-xs text-ink-faint">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Ready to get referred?
          </h2>
          <p className="text-lg text-ink-muted mb-8">
            Join thousands of seekers and referrers building careers together.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all shadow-md hover:shadow-lg text-lg">
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-default py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src="/logo.png" alt="Refrll" className="h-7 w-auto opacity-60" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-faint">
              <Link to="/leaderboard" className="hover:text-ink transition-colors">Leaderboard</Link>
              <Link to="/login"       className="hover:text-ink transition-colors">Sign in</Link>
              <Link to="/register"    className="hover:text-ink transition-colors">Register</Link>
              <span className="text-default hidden sm:inline">|</span>
              <Link to="/terms"       className="hover:text-ink transition-colors">Terms & Conditions</Link>
              <Link to="/privacy"     className="hover:text-ink transition-colors">Privacy Policy</Link>
              <Link to="/cookies"     className="hover:text-ink transition-colors">Cookie Policy</Link>
            </div>
          </div>
          <p className="text-xs text-ink-faint text-center">© {new Date().getFullYear()} Refrll. All rights reserved. Refrll is not a recruitment agency and does not guarantee employment outcomes.</p>
        </div>
      </footer>
    </div>
  );
}
