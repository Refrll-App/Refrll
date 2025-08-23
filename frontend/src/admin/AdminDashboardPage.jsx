import { useState } from 'react';
import { Menu, User, Briefcase, FileText, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useAdminUsers,

  useAdminJobs,

  useAdminApplications,
  
  useAdminStats,
  useAdminTrends,
} from './hooks/useAdmin';
import CreateUserModal from './CreateUserModal';
import CreateJobModal from './CreateJobModal';
import UserTableRow from './UserTableRow';
import JobTableRow from './JobTableRow';
import ApplicationTableRow from './ApplicationTableRow';
import AdminMetrics from './AdminMetrics';
import Chart from './Chart';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);

  const limit = 10;

  const usersQuery = useAdminUsers({ page, limit, search, role: roleFilter });
  const jobsQuery = useAdminJobs({ page, limit, search, status: statusFilter });
  const applicationsQuery = useAdminApplications({ page, limit, search, status: statusFilter });
  const statsQuery = useAdminStats();
  const trendsQuery = useAdminTrends({ range: 'month' });

  const tabs = [
    { id: 'users', label: 'Users', icon: User },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-indigo-600 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Dashboard</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-indigo-700"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
                setSearch('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className={`flex items-center w-full p-4 text-left ${
                activeTab === tab.id ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <tab.icon size={20} className={isSidebarOpen ? 'mr-2' : ''} />
              {isSidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        <header className="bg-white shadow p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={handleSearch}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {(activeTab === 'users' || activeTab === 'jobs') && (
                <button
                  onClick={() =>
                    activeTab === 'users'
                      ? setIsCreateUserModalOpen(true)
                      : setIsCreateJobModalOpen(true)
                  }
                  className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-teal-600 transition duration-300"
                >
                  {activeTab === 'users' ? 'Add User' : 'Add Job'}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                    setSearch('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          {activeTab === 'users' && (
            <div className="mb-4">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="seeker">Seeker</option>
                <option value="referrer">Referrer</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {(activeTab === 'jobs' || activeTab === 'applications') && (
            <div className="mb-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                {activeTab === 'jobs' ? (
                  <>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </>
                ) : (
                  <>
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Content */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Role</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.isLoading ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                      </tr>
                    ))
                  ) : usersQuery.isError ? (
                    <tr><td colSpan="4" className="p-4 text-center text-red-500">Error loading users</td></tr>
                  ) : (
                    usersQuery.data?.users.map((user) => (
                      <UserTableRow key={user._id} user={user} />
                    ))
                  )}
                </tbody>
              </table>
              {usersQuery.data && (
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, usersQuery.data.total)} of {usersQuery.data.total} users
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= usersQuery.data.totalPages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Title</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Company</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Applications</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsQuery.isLoading ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                      </tr>
                    ))
                  ) : jobsQuery.isError ? (
                    <tr><td colSpan="5" className="p-4 text-center text-red-500">Error loading jobs</td></tr>
                  ) : (
                    jobsQuery.data?.jobs.map((job) => (
                      <JobTableRow key={job._id} job={job} />
                    ))
                  )}
                </tbody>
              </table>
              {jobsQuery.data && (
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, jobsQuery.data.total)} of {jobsQuery.data.total} jobs
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= jobsQuery.data.totalPages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Job Title</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Seeker</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationsQuery.isLoading ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                      </tr>
                    ))
                  ) : applicationsQuery.isError ? (
                    <tr><td colSpan="4" className="p-4 text-center text-red-500">Error loading applications</td></tr>
                  ) : (
                    applicationsQuery.data?.applications.map((application) => (
                      <ApplicationTableRow key={application._id} application={application} />
                    ))
                  )}
                </tbody>
              </table>
              {applicationsQuery.data && (
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, applicationsQuery.data.total)} of {applicationsQuery.data.total} applications
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= applicationsQuery.data.totalPages}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {statsQuery.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl shadow-md animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : statsQuery.isError ? (
                <div className="p-4 text-center text-red-500">Error loading stats</div>
              ) : (
                <AdminMetrics stats={statsQuery.data?.stats} />
              )}
              {trendsQuery.isLoading ? (
                <div className="p-4 bg-white rounded-xl shadow-md animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : trendsQuery.isError ? (
                <div className="p-4 text-center text-red-500">Error loading trends</div>
              ) : (
                <Chart trends={trendsQuery?.data?.trends} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
      />
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardPage;