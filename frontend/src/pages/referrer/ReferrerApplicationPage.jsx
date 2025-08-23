import {
  useReferrerApplications,
  useUpdateApplicationStatus,
} from "../../hooks/useJobs";
import { toast } from "react-hot-toast";

export default function ReferrerApplicationsPage() {
  const { data: apps = [] } = useReferrerApplications();

  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const handleStatus = (appId, status) => {
    console.log(appId,status)
    updateStatus({ appId, status }), {
      onSuccess: () => {
        toast.success('Status updated successfully');
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Applications on My Referrals</h1>
      <div className="space-y-4">
        {apps.map((app) => (
          <div key={app._id} className="border p-4 rounded">
            <h2 className="font-semibold">{app.jobId.title}</h2>
            <p className="text-sm text-gray-600">
              {app.seekerId.name} – {app.seekerId.email}
            </p>
            <div className="mt-2 flex gap-2">
              {["applied", "shortlisted", "rejected", "hired"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(app._id, s)}
                  className={`rounded px-2 py-1 text-xs capitalize ${
                    app.status === s
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
