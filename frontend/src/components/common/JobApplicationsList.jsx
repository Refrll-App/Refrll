


import React, { useState, useMemo } from 'react';
import { 
  useApplicationsForJob, 
  useUpdateApplicationStatus 
} from '../../hooks/useJobs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  BadgeCheck, 
  FileText, 
  ChevronDown,
  User,
  Mail,
  Briefcase,
  Award,
  Search,
  Frown,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    applied: { text: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    shortlisted: { text: 'Shortlisted', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
    rejected: { text: 'Rejected', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' },
    hired: { text: 'Hired', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' }
  };

  const config = statusConfig[status] || statusConfig.applied;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

export default function JobApplicationsList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { 
    data: applications, 
    isLoading, 
    error, 
    refetch 
  } = useApplicationsForJob(jobId);
  
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const [editingStatus, setEditingStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter applications
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    
    return applications.filter(app => {
      const matchesSearch = 
        app.seekerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.seekerId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const handleStatusChange = (appId, status) => {
    updateStatus({ appId, status }, {
      onSuccess: () => {
        toast.success('Status updated successfully');
        setEditingStatus(null);
        refetch();
      },
      onError: (err) => toast.error(err?.response?.data?.message || 'Failed to update status'),
    });
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 rounded-lg p-5 text-center">
        <h3 className="text-base font-medium text-rose-800 dark:text-rose-300 mb-2">
          Error loading applications
        </h3>
        <p className="text-rose-600 dark:text-rose-400 text-sm">
          Failed to fetch job applications. Please try again later.
        </p>
      </div>
    </div>
  );

 

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Job Applications
            </h2>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-medium ">
              {applications?.length || 0}  
               {applications?.length === 1?' applicant': ' applicants'} 
              
             
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            Manage candidates who applied for this position
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3 mb-4 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent appearance-none dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-slate-800 text-xs">
              <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-left">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Applicant</th>
                  <th className="px-3 py-2.5 font-medium">Contact</th>
                  <th className="px-3 py-2.5 font-medium">Experience</th>
                  <th className="px-3 py-2.5 font-medium">Skills</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredApplications.map(app => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    {/* Applicant */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {app.seekerId?.avatarUrl ? (
                          <img
                            src={app.seekerId.avatarUrl}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                          />
                        ) : (
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1 rounded-full">
                            <div className="bg-white dark:bg-slate-800 rounded-full p-0.5">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
                            {app.seekerId?.name || 'N/A'}
                            {app.status === 'hired' && (
                              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Applied: {format(new Date(app.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Contact */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{app.seekerId?.email || 'N/A'}</span>
                      </div>
                    </td>
                    
                    {/* Experience */}
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                        <span>{app.seekerId?.experience || 'Not specified'}</span>
                      </div>
                    </td>
                    
                    {/* Skills */}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {app.seekerId?.skills?.slice(0, 2).map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {app.seekerId?.skills?.length > 2 && (
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
                            +{app.seekerId.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-3 py-3">
                      {editingStatus === app._id ? (
                        <select
                          className="w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                          defaultValue={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          onBlur={() => setEditingStatus(null)}
                          autoFocus
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onClick={() => setEditingStatus(app._id)}
                        >
                          <StatusBadge status={app.status} />
                        </div>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-3 py-3 text-right">
                      <a
                        href={`${import.meta.env.VITE_SERVER_URL}/api/upload/download-resume/${app.seekerId._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded text-xs font-medium transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 rounded-lg p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 max-w-2xl mx-auto my-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3">
              <Frown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">
              No applicants found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your filters to find more applicants"
                : "No one has applied for this position yet. Check back later."}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}