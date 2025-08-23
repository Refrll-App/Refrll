import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HrJobApplicationsChart = ({ jobs }) => {
  // Prepare data for chart
  const chartData = jobs.map(job => ({
    name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
    applications: job.applicationCount || 0,
    jobId: job._id
  })).sort((a, b) => b.applications - a.applications);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="text-slate-600 dark:text-slate-300">Applications: </span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end"
          height={60}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickFormatter={(value) => Number.isInteger(value) ? value : ''}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="applications" 
          name="Applications" 
          fill="#6366f1" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HrJobApplicationsChart;