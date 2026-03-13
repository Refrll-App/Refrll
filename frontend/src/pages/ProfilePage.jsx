import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { useUpdateProfileMutation } from "../features/profile/userApi.js";
import { resumeDownloadUrl } from "../utils/resumeUrl.js";
import { useGetReferrerProfileQuery, useUpdatePrivacySettingsMutation } from "../features/referrer/referrerApi.js";
import { Input, Textarea, Button, Card, PageHeader } from "../components/ui/index.jsx";
import CompanySearchInput from "../components/shared/CompanySearchInput.jsx";
import toast from "react-hot-toast";

function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !skills.includes(val)) { onChange([...skills, val]); setInput(""); }
  };
  const remove = (skill) => onChange(skills.filter((s) => s !== skill));
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink">Skills</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add a skill and press Enter"
          className="flex-1 px-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
        />
        <Button type="button" variant="secondary" onClick={add} size="md">Add</Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 bg-accent-soft text-accent text-xs font-medium px-3 py-1.5 rounded-full">
              {s}
              <button type="button" onClick={() => remove(s)} className="text-accent/60 hover:text-accent leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-accent" : "bg-default"}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function PrivacyCard({ userId }) {
  const { data, isLoading } = useGetReferrerProfileQuery(undefined, { skip: false });
  const [updatePrivacy, { isLoading: isSaving }] = useUpdatePrivacySettingsMutation();

  const profile = data?.profile;

  const [showOnLeaderboard,        setShowOnLeaderboard]        = useState(false);
  const [displayAlias,             setDisplayAlias]             = useState("");
  const [receieveCandidateDetails, setReceieveCandidateDetails] = useState(true);
  const [candidateEmailOverride,   setCandidateEmailOverride]   = useState("");
  const [emailError,               setEmailError]               = useState("");

  useEffect(() => {
    if (profile) {
      setShowOnLeaderboard(profile.showOnLeaderboard ?? false);
      setDisplayAlias(profile.displayAlias ?? "");
      setReceieveCandidateDetails(profile.receieveCandidateDetails !== false);
      setCandidateEmailOverride(profile.candidateEmailOverride ?? "");
    }
  }, [profile]);

  if (isLoading) return null;
  if (!profile) return null;

  const handleSave = async () => {
    // Validate override email if provided
    if (candidateEmailOverride.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmailOverride.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    try {
      await updatePrivacy({ showOnLeaderboard, displayAlias, receieveCandidateDetails, candidateEmailOverride: candidateEmailOverride.trim() }).unwrap();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  // Preview what will show on leaderboard
  const makeAlias = (name = "") => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase() + ".";
    return parts[0].charAt(0).toUpperCase() + ". " + parts[parts.length - 1];
  };

  // What name will appear on leaderboard right now
  // We don't have user name here so fetch from parent — pass it as prop
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center text-lg flex-shrink-0">🔒</div>
        <div>
          <h2 className="font-display font-bold text-ink">Leaderboard Privacy</h2>
          <p className="text-xs text-ink-muted mt-0.5">Control how you appear on the public leaderboard</p>
        </div>
      </div>

      <div className="space-y-5">
        <Toggle
          checked={showOnLeaderboard}
          onChange={setShowOnLeaderboard}
          label="Show my real name on leaderboard"
          description="By default you appear anonymously (e.g. 'R. Kumar'). Turn this on to show your full name publicly."
        />

        {!showOnLeaderboard && (
          <div className="border-t border-default pt-5 space-y-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Custom display alias <span className="text-ink-faint font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={displayAlias}
                onChange={(e) => setDisplayAlias(e.target.value)}
                placeholder={`e.g. R. Kumar, Priya M., The Connector`}
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-xl border border-default bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              />
              <p className="text-xs text-ink-faint mt-1.5">
                Leave blank to auto-generate (first initial + last name)
              </p>
            </div>

            {/* Live preview */}
            <div className="bg-surface-alt rounded-xl p-4">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-3">Leaderboard preview</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center font-display font-bold text-accent text-sm">
                  {(displayAlias || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">
                    {displayAlias.trim() || <span className="italic text-ink-muted">(auto-generated alias)</span>}
                  </p>
                  <p className="text-xs text-ink-faint">Anonymous referrer</p>
                </div>
                <span className="ml-auto text-xs bg-surface text-ink-faint border border-default px-2 py-1 rounded-lg">🔒 Private</span>
              </div>
            </div>
          </div>
        )}

        {showOnLeaderboard && (
          <div className="bg-amber-soft border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Heads up:</strong> Your real name will be visible to everyone on the public leaderboard, including your employer. Make sure this is okay with your HR policy before enabling.
            </p>
          </div>
        )}

        {/* Candidate details email preference */}
        <div className="border-t border-default pt-5 space-y-4">
          <div className="flex items-start gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-soft flex items-center justify-center text-lg flex-shrink-0">📧</div>
            <div>
              <h3 className="font-semibold text-ink text-sm">Candidate Details Email</h3>
              <p className="text-xs text-ink-muted mt-0.5">When you refer someone, receive their full profile and resume by email</p>
            </div>
          </div>

          <Toggle
            checked={receieveCandidateDetails}
            onChange={setReceieveCandidateDetails}
            label="Send me candidate details when I refer"
            description="You'll receive the candidate's resume, skills, experience, and application message in your inbox — making it easy to submit the referral in your company portal."
          />

          {receieveCandidateDetails && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink">
                Receive at <span className="text-ink-faint font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={candidateEmailOverride}
                onChange={(e) => { setCandidateEmailOverride(e.target.value); setEmailError(""); }}
                placeholder="your.work@company.com — leave blank to use your Refrll email"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-all ${emailError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : "border-default focus:border-accent focus:ring-accent/10"}`}
              />
              {emailError
                ? <p className="text-xs text-rose-500">{emailError}</p>
                : <p className="text-xs text-ink-faint">Use your work email so the details land in the right inbox</p>
              }
            </div>
          )}
        </div>

        <div className="pt-1">
          <Button onClick={handleSave} disabled={isSaving} variant="secondary" size="sm">
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileRef = useRef();
  const isReferrer = user?.roleMode === "referrer";

  const [form, setForm] = useState({
    name: "", currentCompany: null, skills: [], experience: 0, bio: "", linkedIn: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        currentCompany: user.currentCompanyId
          ? { _id: user.currentCompanyId._id, name: user.currentCompanyId.name, type: user.currentCompanyId.type }
          : null,
        skills: user.skills || [],
        experience: user.experience || 0,
        bio: user.bio || "",
        linkedIn: user.linkedIn || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "experience" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("currentCompanyId", form.currentCompany?._id || "");
      formData.append("experience", form.experience);
      formData.append("bio", form.bio);
      formData.append("linkedIn", form.linkedIn);
      form.skills.forEach((s) => formData.append("skills", s));
      if (resumeFile) formData.append("resume", resumeFile);
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      setResumeFile(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };


const isComplete = user?.name && user?.resumeUrl;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Your Profile" subtitle="Keep your profile up to date to get the best referrals" />

      {!isComplete && (
        <div className="bg-amber-soft border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-lg mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">Complete your profile</p>
            <p className="text-xs text-amber-700 mt-0.5">Upload your resume and fill in your details to start applying or referring.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="font-display font-bold text-ink mb-5">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Alex Johnson" required />
            <Input label="Email" value={user?.email || ""} disabled className="opacity-60 cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CompanySearchInput
              value={form.currentCompany}
              onChange={(company) => setForm((p) => ({ ...p, currentCompany: company }))}
              placeholder="Search Google, Stripe, TCS..."
            />
            <Input label="Years of Experience" name="experience" type="number" min={0} max={60} value={form.experience} onChange={handleChange} />
          </div>
          <div className="mt-4">
            <Input label="LinkedIn URL (optional)" name="linkedIn" type="url" value={form.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
          </div>
          <div className="mt-4">
            <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Brief professional summary..." rows={4} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-bold text-ink mb-5">Skills</h2>
          <SkillsInput skills={form.skills} onChange={(skills) => setForm((p) => ({ ...p, skills }))} />
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-bold text-ink mb-5">Resume</h2>
          {user?.resumeUrl && (
            <div className="flex items-center gap-3 p-3 bg-emerald-soft border border-emerald-200 rounded-xl mb-4">
              <span className="text-emerald-600">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-800">Resume uploaded</p>
                <a href={resumeDownloadUrl(user.resumeUrl, user.name)} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:underline truncate">
                  View current resume
                </a>
              </div>
            </div>
          )}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${resumeFile ? "border-accent bg-accent-soft" : "border-default hover:border-accent/40 hover:bg-surface-alt"}`}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0] || null)} />
            <div className="text-3xl mb-2">{resumeFile ? "✅" : "📤"}</div>
            <p className="text-sm font-medium text-ink">{resumeFile ? resumeFile.name : "Click to upload PDF resume"}</p>
            <p className="text-xs text-ink-faint mt-1">PDF only · Max 5MB</p>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>{isLoading ? "Saving..." : "Save Profile"}</Button>
        </div>
      </form>

      {/* Privacy card — only shown when in referrer mode */}
      {isReferrer && (
        <div className="mt-6">
          <PrivacyCard />
        </div>
      )}
    </div>
  );
}