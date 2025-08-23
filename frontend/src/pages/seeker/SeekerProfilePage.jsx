

import { useState, useEffect, useMemo } from "react";
import {
  useAvatarUploadMutation,
  useProfile,
  useUpdateProfile,
} from "../../hooks/useAuth";
import { useUploadResume } from "../../hooks/useUpload";
import { toast } from "react-hot-toast";
import {
  User,
  Edit,
  Save,
  Mail,
  Phone,
  Link as LinkIcon,
  
  MapPin,
  Briefcase,
  File as FileIcon,
  File,
  Globe,
  X,

  Download,
  Calendar,
  Award,
  GitBranch,
} from "lucide-react";


export default function SeekerProfilePage() {
  const { data: user } = useProfile();
  const { mutate: update, isPending } = useUpdateProfile();
  const { mutate: upload, progress } = useUploadResume();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    github: "",
    company: "",
    location: "",
    designation: "",
    experience: "",
    skills: "",
    resume: "",
    status: "",
    website: "",
    avatarUrl: "",
  });
  const avatarUploadMutation = useAvatarUploadMutation();

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        linkedIn: user.linkedinUrl || "",
        github: user.githubUrl || "",
        company: user.companyId?.name || "",
        location: user.location || "",
        designation: user.designation || "",
        experience: user.yearsOfExp ? `${user.yearsOfExp} years` : "",
        skills: user.skills?.join(", ") || "",
        resume: user.resumeUrl || "",
        status: user.type || "",
        website: user.website || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0]; 
    
    if (file) {
      setIsUploading(true);
      upload(file, {
        onSuccess: (url) => {
          setProfile((prev) => ({ ...prev, resume: url }));
          update({ resumeUrl: url });
          setIsUploading(false);
        },
        onError: (err) => {
          toast.error(err.message);
          setIsUploading(false);
        }
      });
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    update(
      {
        name: profile.fullName,
        phone: profile.phone,
        linkedinUrl: profile.linkedIn,
        githubUrl: profile.github,
        yearsOfExp: profile.experience.replace(" years", ""),
        skills: profile.skills.split(",").map((s) => s.trim()),
        companyName: profile.company,
        location: profile.location,
        designation: profile.designation,
        website: profile.website,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setIsEditing(false);
        },
        onError: (err) =>
          toast.error(
            err?.response?.data?.message || "Failed to update profile"
          ),
      }
    );
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        linkedIn: user.linkedinUrl || "",
        github: user.githubUrl || "",
        company: user.companyId?.name || "",
        location: user.location || "",
        designation: user.designation || "",
        experience: user.yearsOfExp ? `${user.yearsOfExp} years` : "",
        skills: user.skills?.join(", ") || "",
        resume: user.resumeUrl || "",
        status: user.type || "",
        website: user.website || "",
      });
    }
    setIsEditing(false);
  };

  const completionPercentage = useMemo(() => {
    const fields = [
      "fullName",
      "email",
      "phone",
      "location",
      "linkedIn",
      "github",
      "designation",
      "company",
      "experience",
      "skills",
      "resume",
      "website",
    ];
    let completed = 0;

    fields.forEach((field) => {
      if (field === "skills") {
        if (
          profile.skills.trim() &&
          profile.skills.split(",").some((skill) => skill.trim())
        ) {
          completed++;
        }
      }
      else if (field === "experience") {
        if (profile.experience && profile.experience !== "0 years") {
          completed++;
        }
      }
      else if (profile[field] && profile[field].toString().trim()) {
        completed++;
      }
    });

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    avatarUploadMutation.mutate(formData);
  };

  const fileName = profile.resume?.split("/").pop();



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card - Left Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-slate-700 sticky top-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-5 group">
                  <div className="relative">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full shadow-md w-20 h-20">
                        <div className="bg-white dark:bg-slate-800 rounded-full p-1 w-full h-full">
                          <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 rounded-full p-1.5 shadow-sm border border-gray-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors z-30"
                        >
                          <Edit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center w-full">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="text-center w-full mb-1 p-2 border rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-300 text-sm"
                        placeholder="Full Name"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-white">{profile.fullName}</span>
                    )}
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3 text-xs">
                    {isEditing ? (
                      <input
                        type="text"
                        name="designation"
                        value={profile.designation}
                        onChange={handleChange}
                        className="text-center w-full p-2 border rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-300 text-xs"
                        placeholder="Job Title"
                      />
                    ) : (
                      profile.designation
                    )}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-indigo-50 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-medium text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-slate-600">
                      <MapPin size={14} />
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleChange}
                          className="bg-transparent w-20 text-center focus:outline-none text-xs"
                          placeholder="Location"
                        />
                      ) : (
                        profile.location || "Location"
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-indigo-50 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-medium text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-slate-600">
                      <Briefcase size={14} />
                      {profile.status}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-4 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Profile Completion
                      </span>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Complete your profile to increase visibility
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-md font-medium transition-all text-xs shadow-sm"
                      >
                        <Save size={16} />
                        {isPending ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full py-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-md font-medium transition-colors border border-gray-200 dark:border-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-md font-medium transition-all text-xs shadow-sm"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details - Main Content */}
          <div className="w-full lg:w-2/3 space-y-5">
            {/* Contact Information Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="bg-indigo-100 dark:bg-slate-700 p-1.5 rounded-md">
                    <Mail className="text-indigo-600 dark:text-indigo-400" size={18} />
                  </div>
                  Contact Information
                </h3>
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <User size={14} className="text-gray-500 dark:text-slate-500" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Your full name"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.fullName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Phone size={14} className="text-gray-500 dark:text-slate-500" />
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500 dark:text-slate-500" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <LinkIcon size={14} className="text-gray-500 dark:text-slate-500" />
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="linkedIn"
                        value={profile.linkedIn}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="LinkedIn profile URL"
                      />
                    ) : profile.linkedIn ? (
                      <a
                        href={profile.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-2 bg-indigo-50 dark:bg-slate-700 rounded-md border border-indigo-100 dark:border-slate-600 flex items-center gap-1 transition-colors text-sm"
                      >
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        Not provided
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <GitBranch size={14} className="text-gray-500 dark:text-slate-500" />
                      GitHub
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="github"
                        value={profile.github}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="GitHub profile URL"
                      />
                    ) : profile.github ? (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-2 bg-indigo-50 dark:bg-slate-700 rounded-md border border-indigo-100 dark:border-slate-600 flex items-center gap-1 transition-colors text-sm"
                      >
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        Not provided
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Globe size={14} className="text-gray-500 dark:text-slate-500" />
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Your website URL"
                      />
                    ) : profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-2 bg-indigo-50 dark:bg-slate-700 rounded-md border border-indigo-100 dark:border-slate-600 flex items-center gap-1 transition-colors text-sm"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="bg-indigo-100 dark:bg-slate-700 p-1.5 rounded-md">
                    <Briefcase className="text-indigo-600 dark:text-indigo-400" size={18} />
                  </div>
                  Professional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Award size={14} className="text-gray-500 dark:text-slate-500" />
                      Current Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="designation"
                        value={profile.designation}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Your job title"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.designation || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Briefcase size={14} className="text-gray-500 dark:text-slate-500" />
                      Current Company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={profile.company}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                        placeholder="Company name"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.company || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500 dark:text-slate-500" />
                      Experience
                    </label>
                    {isEditing ? (
                      <select
                        name="experience "
                        value={profile.experience.replace(" years", "")}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            experience: `${e.target.value} years`,
                          }))
                        }
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs appearance-none"
                      >
                        <option value="">Select years</option>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (year) => (
                            <option key={year} value={year}>
                              {year} {year === 1 ? "year" : "years"}
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                        {profile.experience || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">
                      Profile Type
                    </label>
                    <p className="text-gray-900 dark:text-slate-300 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600 text-sm">
                      {profile.status || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  Skills
                </label>
                {isEditing ? (
                  <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-slate-700 text-xs"
                    placeholder="List your skills separated by commas"
                    rows={3}
                  />
                ) : (
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600">
                    {profile.skills
                      .split(",")
                      .filter((skill) => skill.trim())
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-indigo-100 dark:bg-slate-600 text-indigo-800 dark:text-indigo-300 rounded-md text-xs font-medium border border-indigo-200 dark:border-slate-500"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="bg-indigo-100 dark:bg-slate-700 p-1.5 rounded-md">
                    <FileIcon className="text-indigo-600 dark:text-indigo-400" size={18} />
                  </div>
                  Resume
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  {profile.resume ? (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-700 rounded-md border border-gray-200 dark:border-slate-600">
                      <div className="bg-indigo-100 dark:bg-slate-600 p-2 rounded-md">
                        <File className="text-indigo-600 dark:text-indigo-400" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-300 break-all text-xs">
                          { "Resume.pdf"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-slate-400 text-xs">No resume uploaded</p>
                  )}
                </div>

                {isEditing ? (
                  <label className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-1 transition-all text-xs shadow-sm">
                    <FileIcon size={14} />
                    {profile.resume ? "Update Resume" : "Upload Resume"}
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                ) : profile.resume ? (
                  <a
                    href={`${import.meta.env.VITE_SERVER_URL}/api/upload/download-resume/${user._id}`}
              
   
                    download="resume.pdf"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-1 transition-all text-xs shadow-sm"
                  >
                    <Download size={14} />
                    Download Resume
                  </a>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-1 transition-all text-xs shadow-sm"
                  >
                    <FileIcon size={14} />
                    Upload Resume
                  </button>
                )}
              </div>

              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      Uploading...
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}