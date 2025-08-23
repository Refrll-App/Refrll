



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateReferralJob } from '../../hooks/useJobs';
import { toast } from 'react-hot-toast';
import {
  Briefcase,
  FileText,
  MapPin,
  Home,
  DollarSign,
  BarChart2,
  Code,
  Send,
  ArrowLeft
} from 'lucide-react';

export default function ReferrerCreateJobPage() {
  const navigate = useNavigate();
  const { mutate: createJob, isPending } = useCreateReferralJob();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    experienceMin: '',
    experienceMax: '',
    skillsRequired: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate salary range
    if (Number(form.salaryMin) > Number(form.salaryMax)) {
      toast.error("Maximum salary must be greater than minimum salary");
      return;
    }
    
    // Validate experience range
    if (Number(form.experienceMin) > Number(form.experienceMax)) {
      toast.error("Maximum experience must be greater than minimum experience");
      return;
    }

    createJob(
      {
        title: form.title,
        description: form.description,
        location: form.location,
        remote: form.remote,
        salaryRange: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax)
        },
        experienceRequired: {
          min: Number(form.experienceMin),
          max: Number(form.experienceMax)
        },
        skillsRequired: form.skillsRequired
      },
      {
        onSuccess: () => {
       
          navigate('/employee/referrer');
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Failed to create job');
        }
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/employee/referrer')} 
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium mb-3"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
              <Briefcase className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Post a New Referral Job</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Fill out the form below to create a new job posting
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Job Title */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                <Briefcase size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Job Title
              </label>
              <div className="relative">
                <input
                  name="title"
                  placeholder="Senior Frontend Developer"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                <FileText size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Job Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  required
                />
                <div className="absolute top-2.5 left-3">
                  <FileText size={16} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Location & Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                  <MapPin size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                  Location
                </label>
                <div className="relative">
                  <input
                    name="location"
                    placeholder="e.g., San Francisco, CA"
                    value={form.location}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-slate-400"/>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                  <Home size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                  Remote Work
                </label>
                {/* <div className="relative flex items-center h-full">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={form.remote}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
                    <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {form.remote ? 'Remote' : 'On-site'}
                    </span>
                  </label>
                </div> */}

                <div className="relative flex items-center h-full">
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name="remote"
      checked={form.remote}
      onChange={handleInputChange}
      className="sr-only peer"
    />
    <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
    <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-300">
      {form.remote ? 'Remote' : 'On-site'}
    </span>
  </label>
</div>

              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                <DollarSign size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Salary Range (LPA)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    name="salaryMin"
                    placeholder="Minimum salary"
                    value={form.salaryMin}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    min="0"
                  />
                 
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="salaryMax"
                    placeholder="Maximum salary"
                    value={form.salaryMax}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    min="0"
                  />
                 
                </div>
              </div>
            </div>

            {/* Experience Range */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                <BarChart2 size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Experience Required (Years)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    name="experienceMin"
                    // placeholder="Minimum years"
                    value={form.experienceMin}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    min="0"
                    step="0.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
                    Min
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="experienceMax"
                    // placeholder="Maximum years"
                    value={form.experienceMax}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    min="0"
                    step="0.5"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
                    Max
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
                <Code size={16} className="mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Required Skills (comma separated)
              </label>
              <div className="relative">
                <input
                  name="skillsRequired"
                  placeholder="e.g., React, Node.js, TypeScript"
                  value={form.skillsRequired}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code size={16} className="text-slate-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-medium py-2.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                {isPending ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>All fields are securely stored and only shared with potential candidates</p>
        </div>
      </div>
    </div>
  );
}