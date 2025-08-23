const AdminMetrics = ({ stats }) => {
  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers || 0 },
    { label: 'Total Jobs', value: stats?.totalJobs || 0 },
    { label: 'Active Jobs', value: stats?.activeJobs || 0 },
    { label: 'Total Applications', value: stats?.totalApplications || 0 },
    { label: 'Applied', value: stats?.applicationStatusCounts?.applied || 0 },
    { label: 'Shortlisted', value: stats?.applicationStatusCounts?.shortlisted || 0 },
    { label: 'Hired', value: stats?.applicationStatusCounts?.hired || 0 },
    { label: 'Rejected', value: stats?.applicationStatusCounts?.rejected || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="p-4 bg-white rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
          <p className="text-2xl font-bold text-indigo-600">{metric.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminMetrics;