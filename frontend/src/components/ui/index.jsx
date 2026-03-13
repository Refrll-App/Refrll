import { memo } from "react";

export const Button = memo(function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:   "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary: "bg-surface-alt text-ink hover:bg-border active:scale-[0.98] border border-default",
    ghost:     "text-ink-muted hover:text-ink hover:bg-surface-alt",
    danger:    "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
    success:   "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
    outline:   "border border-accent text-accent hover:bg-accent-soft",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
});

export const Input = memo(function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all ${error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export const Textarea = memo(function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none ${error ? "border-rose-400" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export const Badge = memo(function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-surface-alt text-ink-muted",
    accent:  "bg-accent-soft text-accent",
    success: "bg-emerald-soft text-emerald-700",
    warning: "bg-amber-soft text-amber-700",
    danger:  "bg-rose-50 text-rose-600",
    neutral: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
});

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-default flex-shrink-0">
          <h2 className="font-display font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-surface-alt text-lg transition-colors">×</button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export const Card = memo(function Card({ children, className = "", hover = false }) {
  return (
    <div className={`bg-white rounded-2xl border border-default shadow-card ${hover ? "hover:shadow-card-hover transition-shadow" : ""} ${className}`}>
      {children}
    </div>
  );
});

export const PageHeader = memo(function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="text-ink-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
});

export const EmptyState = memo(function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-display font-bold text-ink mb-1">{title}</p>
      <p className="text-sm text-ink-muted max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
});

export const Pagination = memo(function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-default text-ink-muted hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ← Prev
      </button>
      <span className="text-sm text-ink-muted px-2">Page {page} of {pages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-default text-ink-muted hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        Next →
      </button>
    </div>
  );
});
