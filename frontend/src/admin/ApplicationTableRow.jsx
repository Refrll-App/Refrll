import { useState } from 'react';
import { useUpdateApplication } from './hooks/useAdmin';

const ApplicationTableRow = ({ application }) => {
  const [status, setStatus] = useState(application.status);
  const updateApplication = useUpdateApplication();

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateApplication.mutate(
      { id: application._id, status: newStatus },
      {
        onError: () => setStatus(application.status), // Revert on error
      }
    );
  };

  return (
    <tr className="border-b hover:bg-indigo-50 transition duration-300">
      <td className="p-4 text-sm">{application.jobId.title}</td>
      <td className="p-4 text-sm">{application.seekerId.name}</td>
      <td className="p-4">
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={updateApplication.isLoading}
        >
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>
      <td className="p-4">comming soon</td>
    </tr>
  );
};

export default ApplicationTableRow;