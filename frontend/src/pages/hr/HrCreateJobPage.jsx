


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../../hooks/useJobs";
import { toast } from "react-hot-toast";
import { Briefcase, MapPin, DollarSign, Code, BarChart2, ChevronDown, Loader } from 'lucide-react';

const initial = {
  title: "",
  description: "",
  location: "",
  remote: false,
  salaryRange: { min: "", max: "" },
  skillsRequired: "",
  experienceRequired: { min: "", max: "" },
  employmentType: "",
  jobLevel: "",
};

export default function HrCreateJobPage() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = useCreateJob();
  const [form, setForm] = useState(initial);
  const [activeTab, setActiveTab] = useState("details");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
      salaryRange: {
        min: Number(form.salaryRange.min),
        max: Number(form.salaryRange.max),
      },
      experienceRequired: {
  min: Number(form.experienceRequired.min),
  max: Number(form.experienceRequired.max),
},

    };
    create(payload, {
      onSuccess: () => {
        toast.success("Job posted successfully!");
        navigate("/hr/dashboard");
      },
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to create job"),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
          <Briefcase className="text-indigo-600 dark:text-indigo-300" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Job Post</h1>
          <p className="text-slate-600 dark:text-slate-400">Fill in the details to attract top talent</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        {/* Form Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            className={`px-5 py-3 font-medium text-sm ${activeTab === "details" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 dark:text-slate-400"}`}
            onClick={() => setActiveTab("details")}
          >
            Job Details
          </button>
          {/* <button
            type="button"
            className={`px-5 py-3 font-medium text-sm ${activeTab === "requirements" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600 dark:text-slate-400"}`}
            onClick={() => setActiveTab("requirements")}
          >
            Requirements
          </button> */}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Job Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="text-slate-400" size={18} />
                </div>
                <input
                  placeholder="e.g., Senior Frontend Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Job Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Job Description
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Markdown/HTML allowed</p>
              <textarea
                placeholder="Describe the role, responsibilities, and what makes your company great..."
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            {/* Location & Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="text-slate-400" size={18} />
                  </div>
                  <input
                    placeholder="e.g., New York, NY"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Remote Work
                </label>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.remote}
                      onChange={(e) => setForm({ ...form, remote: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {form.remote ? "Remote position" : "Office-based"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Salary Range */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                  <DollarSign className="text-indigo-600 dark:text-indigo-300" size={20} />
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white">Salary Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Minimum Salary (LPA)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 6"
                    value={form.salaryRange.min}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        salaryRange: { ...form.salaryRange, min: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Maximum Salary (LPA)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 9"
                    value={form.salaryRange.max}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        salaryRange: { ...form.salaryRange, max: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Experience & Requirements */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                  <BarChart2 className="text-indigo-600 dark:text-indigo-300" size={20} />
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white">Experience & Requirements</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Minimum Experience (years)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 3"
                    value={form.experienceRequired.min}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        experienceRequired: {
                          ...form.experienceRequired,
                          min: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Maximum Experience (years)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 7"
                    value={form.experienceRequired.max}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        experienceRequired: {
                          ...form.experienceRequired,
                          max: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Skills & Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Required Skills (comma separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="text-slate-400" size={18} />
                  </div>
                  <input
                    placeholder="e.g., JavaScript, React, Node.js"
                    value={form.skillsRequired}
                    onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Employment Type
                </label>
                <div className="relative">
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={(e) =>
                      setForm({ ...form, employmentType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="text-slate-400" size={18} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Job Level
                </label>
                <div className="relative">
                  <select
                    name="jobLevel"
                    value={form.jobLevel}
                    onChange={(e) => setForm({ ...form, jobLevel: e.target.value })}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Job Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="text-slate-400" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/hr/dashboard")}
              className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Posting Job...</span>
                </>
              ) : (
                <>
                  <Briefcase size={18} />
                  <span>Post Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
