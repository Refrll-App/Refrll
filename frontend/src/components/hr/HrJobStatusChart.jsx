import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const HrJobStatusChart = ({ jobs }) => {
  // Calculate status distribution
  const statusData = jobs.reduce((acc, job) => {
    const status = job.status || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for chart
  const chartData = Object.entries(statusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            <span className="text-slate-600 dark:text-slate-300">Jobs: </span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {payload[0].value}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-slate-600 dark:text-slate-300">Percentage: </span>
            <span className="font-medium">
              {((payload[0].value / jobs.length) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="vertical" 
          verticalAlign="middle" 
          align="right"
          formatter={(value) => <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default HrJobStatusChart;