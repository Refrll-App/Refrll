import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import { PageHeader } from "../components/ui/index.jsx";
import CompanyGrid from "../components/shared/CompanyGrid.jsx";
import { Link } from "react-router-dom";

export default function FindReferralsPage() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Find Referrals"
        subtitle="Browse companies with active referrers and apply with one click"
      />

      {!user?.resumeUrl && (
        <div className="bg-amber-soft border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Resume missing</p>
              <p className="text-xs text-amber-700">Upload your resume before applying for referrals</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="text-xs font-medium text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Add Resume
          </Link>
        </div>
      )}

      <CompanyGrid />
    </div>
  );
}
