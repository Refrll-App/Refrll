import { useState } from "react";
import toast from "react-hot-toast";

const FEATURES = [
  {
    icon: "📄",
    title: "Resume Review",
    description: "Get your resume reviewed by an insider at your target company before applying.",
    tag: "For Seekers",
    tagColor: "bg-accent-soft text-accent",
  },
  {
    icon: "🎯",
    title: "1:1 Career Sessions",
    description: "Book a direct session with a referrer — mock interviews, career guidance, role clarity.",
    tag: "For Seekers",
    tagColor: "bg-accent-soft text-accent",
  },
  {
    icon: "✅",
    title: "Outcome Tracking",
    description: "Track every referral from application to offer. See what's working, what's not.",
    tag: "For Everyone",
    tagColor: "bg-emerald-soft text-emerald-700",
  },
  {
    icon: "🏢",
    title: "Campus & Bootcamp Access",
    description: "Institutions get bulk referral access for their students at a flat annual fee.",
    tag: "For Institutions",
    tagColor: "bg-amber-soft text-amber-700",
  },
];

function FeatureCard({ icon, title, description, tag, tagColor, notified, onNotify }) {
  return (
    <div className="bg-white border border-default rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Blur overlay to signal "not yet available" */}
      <div className="absolute top-3 right-3">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-ink/5 text-ink-faint border border-default">
          Coming soon
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-surface-alt flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold text-ink text-sm">{title}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}>
              {tag}
            </span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
        </div>
      </div>

      <button
        onClick={() => onNotify(title)}
        disabled={notified}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
          notified
            ? "bg-emerald-soft text-emerald-700 cursor-default"
            : "bg-surface-alt text-ink-muted hover:bg-accent-soft hover:text-accent border border-default"
        }`}
      >
        {notified ? "✓ We'll notify you" : "Notify me when ready"}
      </button>
    </div>
  );
}

export default function ComingSoon() {
  const [notified, setNotified] = useState({});

  const handleNotify = (title) => {
    setNotified((prev) => ({ ...prev, [title]: true }));
    toast.success("Got it! We'll let you know when it launches.", {
      icon: "🔔",
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            What's coming
            <span className="text-sm font-normal bg-accent-soft text-accent px-2.5 py-0.5 rounded-full">
              Roadmap
            </span>
          </h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Features we're building next — tell us what matters to you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.title}
            {...f}
            notified={!!notified[f.title]}
            onNotify={handleNotify}
          />
        ))}
      </div>

      <div className="bg-surface-alt border border-default rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xl flex-shrink-0">💬</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">Have a feature idea?</p>
          <p className="text-xs text-ink-muted">We build what our users actually need.</p>
        </div>
        <a
          href="mailto:feedback@reflink.in"
          className="text-xs font-medium text-accent hover:underline whitespace-nowrap flex-shrink-0"
        >
          Tell us →
        </a>
      </div>
    </section>
  );
}
