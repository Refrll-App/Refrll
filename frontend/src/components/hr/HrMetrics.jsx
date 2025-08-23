import React from 'react';
import { 
  Briefcase, Users, FileText, DollarSign, 
  ArrowUpRight, ArrowDownRight, Loader 
} from 'lucide-react';

const HrMetrics = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const metricData = [
    {
      title: "Total Jobs",
      value: metrics?.totalJobs || 0,
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      change: metrics?.jobChange || 0,
      description: "Job postings"
    },
    {
      title: "Total Applications",
      value: metrics?.totalApplications || 0,
      icon: <FileText className="w-6 h-6 text-teal-600" />,
      change: metrics?.applicationChange || 0,
      description: "Applications received"
    },
    {
      title: "Avg. Salary",
      value: metrics?.avgSalary ? `₹${metrics.avgSalary.toLocaleString()}` : '₹0',
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      change: metrics?.salaryChange || 0,
      description: "Per month"
    }
  ];


  console.log(metrics)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricData.map((metric, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {metric.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {metric.description}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              {metric.icon}
            </div>
          </div>
          
          {metric.change !== 0 && (
            <div className="mt-4 flex items-center">
              <span className={`flex items-center text-sm font-medium ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {Math.abs(metric.change)}%
              </span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                from last month
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HrMetrics;