import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import EmployeeRoutes from "./EmployeeRoutes";
import HrRoutes from "./HrRoutes";
import PrivateRoute from "../components/common/PrivateRoute";
// import AdminInterface from '../admin';
import AdminDashboardPage from "../admin/AdminDashboardPage";
import NotificationCenter from "../components/common/NotificationCenter";
import ReferralLeaderboard from "../pages/ReferralLeadership";

import JobsListingPage from "../pages/jobs/JobListingPage";
import JobDetailPage from "../pages/jobs/JobDetailpage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      <Route
        path="/employee/*"
        element={<PrivateRoute allowed={["employee"]} />}
      >
        <Route path="*" element={<EmployeeRoutes />} />
      </Route>
      <Route path="/hr/*" element={<PrivateRoute allowed={["hr"]} />}>
        <Route path="*" element={<HrRoutes />} />
      </Route>

      <Route path="/admin/*" element={<PrivateRoute allowed={["admin"]} />}>
        <Route path="*" element={<AdminDashboardPage />} />
      </Route>

      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/referrals/leaderboard" element={<ReferralLeaderboard />} />
      <Route path="/jobs" element={<JobsListingPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
    </Routes>
  );
}
