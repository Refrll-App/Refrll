

import { useState, useMemo, useCallback, useEffect, memo } from "react";
import { useGetCompaniesQuery } from "../../features/company/companyApi.js";
import { useCreateApplicationMutation } from "../../features/seeker/applicationApi.js";
import { Modal, Button, Input, Textarea, EmptyState } from "../ui/index.jsx";
import { CardSkeleton } from "../ui/Skeleton.jsx";
import toast from "react-hot-toast";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const COMPANY_COLORS = [
  "from-violet-500 to-purple-600", "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-600",     "from-amber-500 to-yellow-500",
  "from-indigo-500 to-blue-600",   "from-teal-500 to-emerald-600",
];
const TYPE_LABELS = { hr_firm: "HR Firm", consultancy: "Consultancy" };

const CompanyCard = memo(function CompanyCard({ item, index, onApply }) {
  const { company, referrerCount } = item;
  const colorClass = COMPANY_COLORS[index % COMPANY_COLORS.length];
  const initials = useMemo(() =>
    company.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    [company.name]
  );
  const handleApply = useCallback(() =>
    onApply({ id: company._id, name: company.name, type: company.type }),
    [company, onApply]
  );
  return (
    <div className="bg-white rounded-2xl shadow-card border border-default p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-pointer group" onClick={handleApply}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
          <span className="text-white font-display font-bold text-lg">{initials}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {TYPE_LABELS[company.type] && <span className="text-xs font-medium bg-amber-soft text-amber-700 px-2 py-0.5 rounded-full">{TYPE_LABELS[company.type]}</span>}
          {company.isVerified && <span className="text-xs font-medium bg-emerald-soft text-emerald-700 px-2 py-0.5 rounded-full">✓ Verified</span>}
        </div>
      </div>
      <h3 className="font-display font-bold text-ink text-lg mb-1">{company.name}</h3>
      {company.industry && <p className="text-xs text-ink-faint mb-1">{company.industry}</p>}
      <p className="text-xs text-ink-faint mb-4">{referrerCount} active referrer{referrerCount !== 1 ? "s" : ""}</p>
      <button className="w-full text-sm font-medium text-accent bg-accent-soft hover:bg-accent hover:text-white px-4 py-2.5 rounded-xl transition-all">
        Apply for referral →
      </button>
    </div>
  );
});

const EMPTY_FORM = { jobId: "", jobTitle: "", jobUrl: "", noticePeriod: "", message: "" };

const ApplyModal = memo(function ApplyModal({ selectedCompany, isOpen, onClose }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [createApplication, { isLoading }] = useCreateApplicationMutation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.jobTitle.trim()) e.jobTitle = "Job title is required";
    if (form.message.trim().length < 50) e.message = `Need at least 50 characters (${form.message.trim().length}/50)`;
    return e;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await createApplication({ companyId: selectedCompany.id, ...form }).unwrap();
      toast.success("Application submitted! A referrer will review it shortly.");
      onClose();
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit application");
    }
  }, [form, selectedCompany, createApplication, onClose]);

  if (!selectedCompany) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply at ${selectedCompany.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="bg-surface-alt rounded-xl p-4">
          <p className="text-xs text-ink-muted font-medium mb-0.5">Applying to</p>
          <p className="text-sm font-semibold text-ink">{selectedCompany.name}</p>
        </div>

        <Input label="Job Title *" name="jobTitle" value={form.jobTitle} onChange={handleChange}
          placeholder="e.g. Senior Software Engineer" error={errors.jobTitle} />

        <div>
          <Input label="LinkedIn Job URL" name="jobUrl" type="url" value={form.jobUrl} onChange={handleChange}
            placeholder="https://linkedin.com/jobs/view/..." />
          <p className="text-xs text-ink-faint mt-1">Paste the job link — helps referrer find the role internally</p>
        </div>

        <Input label="Job ID (optional)" name="jobId" value={form.jobId} onChange={handleChange}
          placeholder="e.g. SWE-2024-123 (if shown on posting)" />

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Notice Period</label>
          <select
            name="noticePeriod"
            value={form.noticePeriod}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          >
            <option value="">Select notice period</option>
            <option value="Immediate">Immediate joiner</option>
            <option value="15 days">15 days</option>
            <option value="30 days">30 days</option>
            <option value="45 days">45 days</option>
            <option value="60 days">60 days</option>
            <option value="90 days">90 days</option>
            <option value="Serving notice">Currently serving notice</option>
          </select>
        </div>

        <div>
          <Textarea label="Why are you a great fit? *" name="message" value={form.message} onChange={handleChange}
            placeholder="Describe your relevant experience, why you're excited about this role, and what makes you stand out. Min 50 characters.
             And also mention these details few companies required these details in the message box, so it's better to include them if you have that info:
// ✓ First Name :
// ✓ Last Name :
// ✓ Skills :
// ✓ Experience :
// ✓ Domain :
// ✓ DOB :
// ✓ Email :
// ✓ Alt Email :
// ✓ Phone Number :
// ✓ Alt Phone Number :
// ✓ Preferred Location :
// ✓ Preferred Interview Location :
// ✓ Current Organization :
// ✓ Previous Organizations :
// ✓ Notice Period :"
            rows={5} error={errors.message} />
          <p className={`text-xs text-right mt-1 ${form.message.length < 50 ? "text-ink-faint" : "text-emerald-600"}`}>
            {form.message.length} / 50 min
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-emerald-soft border border-emerald-200 rounded-xl">
          <span className="text-emerald-600 text-sm">📎</span>
          <p className="text-xs text-emerald-800">Your uploaded resume will be automatically attached</p>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default function CompanyGrid() {
  const { data, isLoading, error } = useGetCompaniesQuery();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const handleClose = useCallback(() => setSelectedCompany(null), []);

  const companies = useMemo(() => {
    const all = data?.companies || [];
    if (!debouncedSearch.trim()) return all;
    const q = debouncedSearch.toLowerCase();
    return all.filter((item) => item.company.name.toLowerCase().includes(q));
  }, [data, debouncedSearch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-default rounded-xl animate-pulse w-full max-w-xs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) return <EmptyState icon="⚠️" title="Failed to load companies" description="Please refresh the page" />;
  const allCompanies = data?.companies || [];
  if (!allCompanies.length) return <EmptyState icon="🏢" title="No companies yet" description="No companies have active referrers right now." />;

  return (
    <>
      <div className="mb-5">
        <div className="relative max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink text-lg leading-none">×</button>}
        </div>
        {debouncedSearch && <p className="text-xs text-ink-faint mt-2">{companies.length} result{companies.length !== 1 ? "s" : ""} for "{debouncedSearch}"</p>}
      </div>

      {companies.length === 0 ? (
        <EmptyState icon="🔍" title="No companies found" description={`No match for "${debouncedSearch}"`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {companies.map((item, i) => (
            <CompanyCard key={item.company._id} item={item} index={i} onApply={setSelectedCompany} />
          ))}
        </div>
      )}
      <ApplyModal selectedCompany={selectedCompany} isOpen={!!selectedCompany} onClose={handleClose} />
    </>
  );
}