import { Routes, Route } from "react-router-dom";
import SeekerDashboardPage from "../pages/seeker/SeekerDashboardpage";
import SeekerProfilePage from "../pages/seeker/SeekerProfilePage";
import ReferrerDashboardPage from "../pages/referrer/ReferrerDashboardPage";

import SeekerLayout from "../pages/seeker/SeekerLayout";
import ReferrerLayout from "../pages/referrer/ReferrerLayout";

import ReferrerCreateJobPage from "../pages/referrer/ReferrerCreateJobPage";

import ReferrerClaimJob from "../pages/referrer/ReferrerClaimJob";

import SeekerApplicationsPage from "../pages/seeker/SeekerApplicationsPage";
import JobApplicationsList from "../components/common/JobApplicationsList";

export default function EmployeeRoutes() {
  return (
    <Routes>
      {/* Seeker-only sub-routes */}
      <Route element={<SeekerLayout />}>
        <Route path="dashboard" element={<SeekerDashboardPage />} />
        <Route path="profile" element={<SeekerProfilePage />} />
        <Route path="seekerApplications" element={<SeekerApplicationsPage />} />
      </Route>

      {/* Referrer-only sub-routes */}
      <Route element={<ReferrerLayout />}>
        <Route path="referrer" element={<ReferrerDashboardPage />} />
        <Route path="referrals/create" element={<ReferrerCreateJobPage />} />

        <Route path="claimJob" element={<ReferrerClaimJob />} />
      </Route>

      <Route path="referrals/:jobId" element={<JobApplicationsList />} />
    </Routes>
  );
}
