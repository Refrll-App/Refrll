
// import { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { useHrJobs, useDeleteJob, useHrDashboardMetrics } from '../../hooks/useJobs';
// import { toast } from 'react-hot-toast';
// import { 
//   Trash2, Edit, Eye, Plus, Search, Filter, ChevronDown, ChevronUp, 
//   Briefcase, Users, FileText, BarChart2, Calendar, DollarSign, MapPin
// } from 'lucide-react';
// import HrMetrics from '../../components/hr/HrMetrics';
// import { debounce } from 'lodash';
// import { useProfile } from '../../hooks/useAuth';

// // Status badge component
// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
//     paused: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
//     closed: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
//     default: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' }
//   };

//   const config = statusConfig[status] || statusConfig.default;

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );
// };

// export default function HrDashboardPage() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const limit = 10;
//     const { data: user } = useProfile();
  

//   const { data: metrics, isLoading: metricsLoading } = useHrDashboardMetrics();
//   const { data, isLoading, refetch } = useHrJobs({ 
//     page, 
//     limit, 
//     search, 
//     status: statusFilter,
//     sort: sortField,
//     order: sortDirection
//   });
  
//   const { mutate: deleteJob } = useDeleteJob();

//   const handleDelete = (id) => {

//       deleteJob(id, {
//         onSuccess: () => {
//           toast.success("Job deleted");
//           refetch();
//         },
//       });
    
//   };

//   const handleSearch = useMemo(() => debounce((value) => {
//     setSearch(value);
//     setPage(1);
//   }, 300), []);

//   const toggleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('desc');
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <div>
//           <span className="text-xl font-bold text-slate-800">Welcome </span>
//           <span className='text-xl font-bold text-indigo-400' >{user.name}</span>
//           <p className="text-slate-600 text-sm mt-1">
//             Manage your company's job postings and applications
//           </p>
//         </div>
//         <Link
//           to="/hr/create-job"
//           className="flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 transition-colors"
//         >
//           <Plus size={16} />
//           Post New Job
//         </Link>
//       </div>

//       {/* Metrics */}
//       <HrMetrics metrics={metrics} loading={metricsLoading} />

//       {/* Job List Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
//         <h2 className="text-lg font-semibold text-slate-800">
//           Job Postings
//           {data?.total > 0 && (
//             <span className="text-slate-500 text-sm font-normal ml-2">
//               ({data?.total} jobs)
//             </span>
//           )}
//         </h2>
        
//         <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
//           <div className="relative w-full sm:w-56">
//             <input
//               type="text"
//               placeholder="Search jobs..."
//               className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//             <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
//           </div>
          
//           <select 
//             className="text-sm bg-white border border-slate-300 rounded px-3 py-1.5"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="paused">Paused</option>
//             <option value="closed">Closed</option>
//           </select>
//         </div>
//       </div>

//       {/* Job Table */}
//       <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-200">
//             <thead className="bg-slate-50">
//               <tr>
//                 <th 
//                   scope="col" 
//                   className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => toggleSort('title')}
//                 >
//                   <div className="flex items-center">
//                     <span>Job Title</span>
//                     {sortField === 'title' && (
//                       sortDirection === 'asc' ? 
//                         <ChevronUp className="ml-1 w-4 h-4" /> : 
//                         <ChevronDown className="ml-1 w-4 h-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => toggleSort('applicationCount')}
//                 >
//                   <div className="flex items-center justify-center">
//                     <span>Applicants</span>
//                     {sortField === 'applicationCount' && (
//                       sortDirection === 'asc' ? 
//                         <ChevronUp className="ml-1 w-4 h-4" /> : 
//                         <ChevronDown className="ml-1 w-4 h-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th 
//                   scope="col" 
//                   className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => toggleSort('createdAt')}
//                 >
//                   <div className="flex items-center">
//                     <span>Posted</span>
//                     {sortField === 'createdAt' && (
//                       sortDirection === 'asc' ? 
//                         <ChevronUp className="ml-1 w-4 h-4" /> : 
//                         <ChevronDown className="ml-1 w-4 h-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
            
//             <tbody className="bg-white divide-y divide-slate-200">
//               {isLoading ? (
//                 Array.from({ length: 5 }).map((_, i) => (
//                   <tr key={i}>
//                     <td className="px-4 py-3 animate-pulse">
//                       <div className="h-4 bg-slate-200 rounded w-3/4"></div>
//                     </td>
//                     <td className="px-4 py-3 animate-pulse">
//                       <div className="h-4 bg-slate-200 rounded w-2/3"></div>
//                     </td>
//                     <td className="px-4 py-3 text-center animate-pulse">
//                       <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
//                     </td>
//                     <td className="px-4 py-3 animate-pulse">
//                       <div className="h-4 bg-slate-200 rounded w-1/2"></div>
//                     </td>
//                     <td className="px-4 py-3 text-center animate-pulse">
//                       <div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div>
//                     </td>
//                     <td className="px-4 py-3 text-right animate-pulse">
//                       <div className="h-8 bg-slate-200 rounded w-24 float-right"></div>
//                     </td>
//                   </tr>
//                 ))
//               ) : data?.jobs?.length ? (
//                 data.jobs.map((job) => (
//                   <tr key={job._id} className="hover:bg-slate-50 transition-colors">
//                     <td className="px-4 py-3 max-w-xs">
//                       <div className="font-medium text-sm text-slate-800">{job.title}</div>
//                       <div className="flex flex-wrap gap-1 mt-1">
//                         {job.skillsRequired.slice(0, 3).map((skill, i) => (
//                           <span 
//                             key={i} 
//                             className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                         {job.skillsRequired.length > 3 && (
//                           <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
//                             +{job.skillsRequired.length - 3}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center text-sm text-slate-700">
//                         <MapPin className="w-4 h-4 mr-1 text-slate-500" />
//                         <span>
//                           {job.location || 'Remote'}
//                           {job.remote && ' (Remote)'}
//                         </span>
//                       </div>
//                       <div className="text-xs text-slate-500 mt-1">
//                         ₹ {job.salaryRange.min} - {job.salaryRange.max} LPA
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <div className="flex flex-col items-center">
//                         <span className="font-medium text-sm">{job.applicationCount || 0}</span>
//                         <Link
//                           to={`/hr/jobs/${job._id}/applications`}
//                           className="text-xs text-indigo-600 hover:underline mt-1"
//                         >
//                           View all
//                         </Link>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="text-sm text-slate-700">
//                         {formatDate(job.createdAt)}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <StatusBadge status={job.status} />
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <div className="flex justify-end gap-2">
//                         <Link
//                           to={`/hr/jobs/${job._id}/applications`}
//                           className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
//                           title="View Applications"
//                         >
//                           <Eye className="w-4 h-4 text-slate-700" />
//                         </Link>
//                         <Link
//                           to={`/hr/edit-job/${job._id}`}
//                           className="p-1.5 rounded-md hover:bg-blue-100 transition-colors"
//                           title="Edit Job"
//                         >
//                           <Edit className="w-4 h-4 text-blue-600" />
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(job._id)}
//                           className="p-1.5 rounded-md hover:bg-red-100 transition-colors"
//                           title="Delete Job"
//                         >
//                           <Trash2 className="w-4 h-4 text-red-600" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
//                       <h3 className="mt-4 text-base font-medium text-slate-700">No job postings</h3>
//                       <p className="mt-2 text-sm text-slate-500 max-w-md">
//                         You haven't created any jobs yet. Post your first job to start receiving applications.
//                       </p>
//                       <div className="mt-4">
//                         <Link
//                           to="/hr/create-job"
//                           className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
//                         >
//                           <Plus size={14} />
//                           Post New Job
//                         </Link>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {data?.totalPages > 1 && (
//         <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 mt-4">
//           <div className="text-sm text-slate-600">
//             Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
//             <span className="font-medium">{Math.min(page * limit, data?.total)}</span> of{' '}
//             <span className="font-medium">{data?.total}</span> jobs
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setPage(p => Math.max(p - 1, 1))}
//               disabled={page === 1}
//               className={`px-3 py-1 text-sm rounded ${
//                 page === 1
//                   ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                   : 'bg-white border border-slate-300 hover:bg-slate-50'
//               }`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setPage(p => Math.min(p + 1, data?.totalPages))}
//               disabled={page === data?.totalPages}
//               className={`px-3 py-1 text-sm rounded ${
//                 page === data?.totalPages
//                   ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                   : 'bg-white border border-slate-300 hover:bg-slate-50'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHrJobs, useDeleteJob, useHrDashboardMetrics } from '../../hooks/useJobs';
import { toast } from 'react-hot-toast';
import { 
  Trash2, Edit, Eye, Plus, Search, Filter, ChevronDown, ChevronUp, 
  Briefcase, Users, FileText, BarChart2, Calendar, DollarSign, MapPin
} from 'lucide-react';
import HrMetrics from '../../components/hr/HrMetrics';
import { debounce } from 'lodash';
import { useProfile } from '../../hooks/useAuth';

// Status badge component with dark theme support
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-300', 
      border: 'border-green-200 dark:border-green-800' 
    },
    paused: { 
      bg: 'bg-amber-100 dark:bg-amber-900/30', 
      text: 'text-amber-800 dark:text-amber-300', 
      border: 'border-amber-200 dark:border-amber-800' 
    },
    closed: { 
      bg: 'bg-rose-100 dark:bg-rose-900/30', 
      text: 'text-rose-800 dark:text-rose-300', 
      border: 'border-rose-200 dark:border-rose-800' 
    },
    default: { 
      bg: 'bg-slate-100 dark:bg-slate-700', 
      text: 'text-slate-800 dark:text-slate-300', 
      border: 'border-slate-200 dark:border-slate-600' 
    }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function HrDashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const limit = 10;
  const { data: user } = useProfile();
  

  const { data: metrics, isLoading: metricsLoading } = useHrDashboardMetrics();
  const { data, isLoading, refetch } = useHrJobs({ 
    page, 
    limit, 
    search, 
    status: statusFilter,
    sort: sortField,
    order: sortDirection
  });
  
  const { mutate: deleteJob } = useDeleteJob();

  const handleDelete = (id) => {
      deleteJob(id, {
        onSuccess: () => {
          toast.success("Job deleted");
          refetch();
        },
      });
  };

  const handleSearch = useMemo(() => debounce((value) => {
    setSearch(value);
    setPage(1);
  }, 500), []);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Welcome </span>
          <span className='text-xl font-bold text-indigo-400 dark:text-indigo-300' >{user?.name}</span>
          <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">
            Manage your company's job postings and applications
          </p>
        </div>
        <Link
          to="/hr/create-job"
          className="flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          <Plus size={16} />
          Post New Job
        </Link>
      </div>

      {/* Metrics */}
      <HrMetrics metrics={metrics} loading={metricsLoading} />

      {/* Job List Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Job Postings
          {data?.total > 0 && (
            <span className="text-slate-500 text-sm font-normal ml-2 dark:text-slate-400">
              ({data?.total} jobs)
            </span>
          )}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-indigo-600"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400 dark:text-slate-500" />
          </div>
          
          <select 
            className="text-sm bg-white border border-slate-300 rounded px-3 py-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Job Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer dark:text-slate-400"
                  onClick={() => toggleSort('title')}
                >
                  <div className="flex items-center">
                    <span>Job Title</span>
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                  Location
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer dark:text-slate-400"
                  onClick={() => toggleSort('applicationCount')}
                >
                  <div className="flex items-center justify-center">
                    <span>Applicants</span>
                    {sortField === 'applicationCount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer dark:text-slate-400"
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className="flex items-center">
                    <span>Posted</span>
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 w-4 h-4" /> : 
                        <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 dark:bg-slate-700"></div>
                    </td>
                    <td className="px-4 py-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-2/3 dark:bg-slate-700"></div>
                    </td>
                    <td className="px-4 py-3 text-center animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto dark:bg-slate-700"></div>
                    </td>
                    <td className="px-4 py-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/2 dark:bg-slate-700"></div>
                    </td>
                    <td className="px-4 py-3 text-center animate-pulse">
                      <div className="h-6 bg-slate-200 rounded w-16 mx-auto dark:bg-slate-700"></div>
                    </td>
                    <td className="px-4 py-3 text-right animate-pulse">
                      <div className="h-8 bg-slate-200 rounded w-24 float-right dark:bg-slate-700"></div>
                    </td>
                  </tr>
                ))
              ) : data?.jobs?.length ? (
                data.jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{job.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skillsRequired.slice(0, 3).map((skill, i) => (
                          <span 
                            key={i} 
                            className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full dark:bg-indigo-900/30 dark:text-indigo-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full dark:bg-slate-700 dark:text-slate-400">
                            +{job.skillsRequired.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                        <MapPin className="w-4 h-4 mr-1 text-slate-500 dark:text-slate-400" />
                        <span>
                          {job.location || 'Remote'}
                          {job.remote && ' (Remote)'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                        ₹ {job.salaryRange.min} - {job.salaryRange.max} LPA
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-sm dark:text-slate-200">{job.applicationCount || 0}</span>
                        <Link
                          to={`/hr/jobs/${job._id}/applications`}
                          className="text-xs text-indigo-600 hover:underline mt-1 dark:text-indigo-400"
                        >
                          View all
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {formatDate(job.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/hr/jobs/${job._id}/applications`}
                          className="p-1.5 rounded-md hover:bg-slate-100 transition-colors dark:hover:bg-slate-700"
                          title="View Applications"
                        >
                          <Eye className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        </Link>
                        <Link
                          to={`/hr/edit-job/${job._id}`}
                          className="p-1.5 rounded-md hover:bg-blue-100 transition-colors dark:hover:bg-blue-900/30"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Link>
                        {/* <button
                          onClick={() => handleDelete(job._id)}
                          className="p-1.5 rounded-md hover:bg-red-100 transition-colors dark:hover:bg-red-900/30"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Briefcase className="w-12 h-12 text-slate-400 mx-auto dark:text-slate-500" />
                      <h3 className="mt-4 text-base font-medium text-slate-700 dark:text-slate-300">No job postings</h3>
                      <p className="mt-2 text-sm text-slate-500 max-w-md dark:text-slate-400">
                        You haven't created any jobs yet. Post your first job to start receiving applications.
                      </p>
                      <div className="mt-4">
                        <Link
                          to="/hr/create-job"
                          className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                          <Plus size={14} />
                          Post New Job
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 mt-4 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-medium dark:text-slate-300">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium dark:text-slate-300">{Math.min(page * limit, data?.total)}</span> of{' '}
            <span className="font-medium dark:text-slate-300">{data?.total}</span> jobs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 text-sm rounded ${
                page === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                  : 'bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, data?.totalPages))}
              disabled={page === data?.totalPages}
              className={`px-3 py-1 text-sm rounded ${
                page === data?.totalPages
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                  : 'bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}