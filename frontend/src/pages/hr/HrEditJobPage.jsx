

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUpdateJob, useGetJobById } from '../../hooks/useJobs';
import { toast } from 'react-hot-toast';
import { Briefcase, MapPin, DollarSign, Code, BarChart2, ChevronDown, Loader, Calendar, Users, Globe, FileText, Award, RefreshCw } from 'lucide-react';

export default function HrEditJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, error } = useGetJobById(jobId);
  const { mutate: updateJob, isPending } = useUpdateJob();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    remote: false,
    salaryRange: { min: '', max: '' },
    skillsRequired: '',
    experienceRequired: { min: '', max: '' },
    employmentType: '',
    jobLevel: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        remote: job.remote || false,
        salaryRange: job.salaryRange || { min: '', max: '' },
        skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : '',
        experienceRequired: job.experienceRequired || { min: '', max: '' },
        employmentType: job.employmentType || '',
        jobLevel: job.jobLevel || '',
        applicationDeadline: job.applicationDeadline || '',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedJob = {
      ...formData,
      skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()),
    };
    
    updateJob({ jobId, updatedJob }, {
      onSuccess: () => {
        toast.success('Job updated successfully!');
        navigate('/hr/dashboard');
      },
      onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update job'),
    });
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin text-indigo-600" size={32} />
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Error Loading Job</h2>
        <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
          <Briefcase className="text-indigo-600 dark:text-indigo-300" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Job Post</h1>
          <p className="text-slate-600 dark:text-slate-400">Update the details for this job listing</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
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
                      name="remote"
                      checked={formData.remote}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formData.remote ? "Remote position" : "Office-based"}
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
                    Minimum Salary ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 60000"
                    name="salaryRange.min"
                    value={formData.salaryRange.min}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Maximum Salary ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 90000"
                    name="salaryRange.max"
                    value={formData.salaryRange.max}
                    onChange={handleChange}
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
                    name="experienceRequired.min"
                    value={formData.experienceRequired.min}
                    onChange={handleChange}
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
                    name="experienceRequired.max"
                    value={formData.experienceRequired.max}
                    onChange={handleChange}
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
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleChange}
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
                    value={formData.employmentType}
                    onChange={handleChange}
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
                    value={formData.jobLevel}
                    onChange={handleChange}
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
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Application Deadline
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-slate-400" size={18} />
                  </div>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
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
                  <span>Updating Job...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Update Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}