import { useState } from 'react';
import { useUpdateJob, useDeleteJob } from './hooks/useAdmin';
import { Trash2 } from 'lucide-react';

const JobTableRow = ({ job }) => {
  const [status, setStatus] = useState(job.status);
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateJob.mutate(
      { id: job._id, status: newStatus },
      {
        onError: () => setStatus(job.status), // Revert on error
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob.mutate(job._id);
    }
  };

  return (
    <tr className="border-b hover:bg-indigo-50 transition duration-300">
      <td className="p-4 text-sm">{job.title}</td>
      <td className="p-4 text-sm">{job.companyId.name}</td>
      <td className="p-4">
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={updateJob.isLoading}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
      </td>
      <td className="p-4 text-sm">{job.applicationCount}</td>
      <td className="p-4">
        <button
          onClick={handleDelete}
          disabled={deleteJob.isLoading}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default JobTableRow;