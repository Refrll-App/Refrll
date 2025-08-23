

import React, { useState } from 'react';
import { useMyApplications } from '../../hooks/useJobs';
import { useProfile } from "../../hooks/useAuth";
import { 
  Calendar, 
  ChevronDown, 
  RefreshCw, 
  Briefcase, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  Eye, 
  List, 
  UserCheck, 
  XCircle, 
  Award,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ApplicationCard = ({ app }) => {
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'applied': return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: <CheckCircle size={12} /> };
      case 'viewed': return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: <Eye size={12} /> };
      case 'shortlisted': return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', icon: <List size={12} /> };
      case 'interviewed': return { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: <UserCheck size={12} /> };
      case 'rejected': return { color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300', icon: <XCircle size={12} /> };
      case 'offered': return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', icon: <Award size={12} /> };
      default: return { color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300', icon: <Clock size={12} /> };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition p-3 text-xs">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-white mb-1 truncate">{app.jobId.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
            <Briefcase size={12} /> 
            <span className="truncate">{app?.jobId.companyId.name || "Company"}</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin size={12} /> 
            <span className="truncate">{app.jobId.location}</span>
          </p>
        </div>
        <span className={`${getStatusInfo(app.status).color} px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-medium`}>
          {getStatusInfo(app.status).icon} 
          <span className="hidden sm:inline">{app.status}</span>
        </span>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between">
        <div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Applied</p>
          <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar size={12} /> {formatDate(app.createdAt)}
          </p>
        </div>
        {app.referrerId && (
          <div className="text-right">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Referred by</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
              <User size={12} /> 
              <span className="truncate max-w-[80px]">{app.referrerId.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonJobCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-1"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-3"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
  </div>
);

export default function SeekerApplicationsPage() {
  const [filters, setFilters] = useState({ status: '', type: '', search: '', sort: 'newest' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { data: applications, isLoading, isError, refetch } = useMyApplications();
  const { data: user } = useProfile();
  const navigate = useNavigate();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setFilters({ status: '', type: '', search: '', sort: 'newest' });
    setCurrentPage(1);
  };

  const filteredApplications = applications?.filter(app => {
    return (
      (!filters.status || app.status.toLowerCase() === filters.status.toLowerCase()) &&
      (!filters.type || app.type.toLowerCase() === filters.type.toLowerCase()) &&
      (!filters.search || 
        app.jobId.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        app.jobId.location.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }).sort((a, b) => 
    filters.sort === 'newest' ? 
      new Date(b.createdAt) - new Date(a.createdAt) : 
      new Date(a.createdAt) - new Date(b.createdAt)
  ) || [];

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getStatusCount = status => 
    applications?.filter(app => app.status.toLowerCase() === status.toLowerCase()).length || 0;

  if (!user) return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs">
      Please log in to view applications.
    </div>
  );
  
  if (isError) return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 rounded-lg p-5 text-center">
        <h3 className="text-base font-medium text-rose-800 dark:text-rose-300 mb-2">
          Error loading applications
        </h3>
        <p className="text-rose-600 dark:text-rose-400 text-sm">
          Failed to fetch your applications. Please try again later.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              My Applications
            </h1>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {applications?.length || 0} total
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            Track and manage all your job applications in one place
          </p>
        </div>
        <button 
          onClick={refetch} 
          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 text-xs">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
          <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">{applications?.length || 0}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
          <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">{getStatusCount('applied')}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Applied</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800">
          <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">{getStatusCount('shortlisted')}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400">Shortlisted</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{getStatusCount('hired')}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400">Offers</div>
        </div>
      </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)}
          </div>
        ) : currentApplications.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentApplications.map((app) => <ApplicationCard key={app._id} app={app} />)}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-5">
                <nav className="inline-flex rounded-md shadow-sm text-xs">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1}
                    className={`px-2.5 py-1.5 border ${currentPage === 1 ? 
                      'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 
                      'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = 
                      currentPage <= 3 ? i + 1 :
                      currentPage >= totalPages - 2 ? totalPages - 4 + i :
                      currentPage - 2 + i;
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2.5 py-1.5 border ${currentPage === pageNum ? 
                          'bg-indigo-500 text-white border-indigo-500' : 
                          'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className={`px-2.5 py-1.5 border ${currentPage === totalPages ? 
                      'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 
                      'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center shadow-sm max-w-2xl mx-auto">
            <Briefcase size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">
              No applications found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {filters.status || filters.type || filters.search ? 
                "No results match your filters. Try different criteria." : 
                "You haven't applied to any jobs yet."}
            </p>
            <button 
              onClick={clearFilters} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg"
            >
              {filters.status || filters.type || filters.search ? 
                "Clear Filters" : 
                "Browse Jobs"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}