import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, Edit, Eye, MapPin, Calendar, Users, Briefcase 
} from 'lucide-react';

const HrJobCard = ({ job, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 md:col-span-5">
          <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">{job.title}</h3>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location || 'Remote'}
          </div>
        </div>
        
        <div className="col-span-6 md:col-span-2">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-slate-500 dark:text-slate-400" />
            <span className="font-medium">{job.applicationCount || 0}</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">applicants</span>
          </div>
        </div>
        
        <div className="col-span-6 md:col-span-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300">
              {new Date(job.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-3 flex justify-end space-x-2">
          <Link
            to={`/hr/jobs/${job._id}/applications`}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            title="View Applications"
          >
            <Eye className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Link>
          <Link
            to={`/hr/edit-job/${job._id}`}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200"
            title="Edit Job"
          >
            <Edit className="w-5 h-5 text-blue-700" />
          </Link>
          <button
            onClick={() => onDelete(job._id)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200"
            title="Delete Job"
          >
            <Trash2 className="w-5 h-5 text-red-700" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <span className={`px-2.5 py-0.5 text-xs rounded-full ${getStatusColor(job.status)}`}>
          {job?.status?.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
        <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
          {job.remote ? 'Remote' : 'On-site'}
        </span>
        <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
          ₹{job.salaryRange.min.toLocaleString()} - ₹{job.salaryRange.max.toLocaleString()}
        </span>
        {job.skillsRequired.slice(0, 3).map((skill, i) => (
          <span 
            key={i} 
            className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400"
          >
            {skill}
          </span>
        ))}
        {job.skillsRequired.length > 3 && (
          <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
            +{job.skillsRequired.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

export default HrJobCard;




