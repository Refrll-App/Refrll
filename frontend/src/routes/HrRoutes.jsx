import { Routes, Route } from 'react-router-dom';
import HrDashboardPage from '../pages/hr/HrDashboardPage';
import HrCreateJobPage from '../pages/hr/HrCreateJobPage';
import HrEditJobPage from '../pages/hr/HrEditJobPage';
import HrApplicationsPage from '../pages/hr/HrApplicationsPage';


export default function HrRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<HrDashboardPage />} />
      <Route path="create-job" element={<HrCreateJobPage />} />
      <Route path="edit-job/:jobId" element={<HrEditJobPage />} />
      <Route path="jobs/:jobId/applications" element={<HrApplicationsPage />} />
      
    </Routes>
  );
}