// import { lazy, Suspense, useEffect, useRef, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Toaster } from "react-hot-toast";
// import { setCredentials, setInitialized } from "./features/auth/authSlice.js";
// import { selectIsAuthenticated, selectCurrentUser } from "./features/auth/authSlice.js";
// import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
// import AppLayout from "./components/layout/AppLayout.jsx";
// import PageLoader from "./components/ui/PageLoader.jsx";
// import CookieBanner from "./components/shared/CookieBanner.jsx";

// const LandingPage       = lazy(() => import("./pages/LandingPage.jsx"));
// const LoginPage         = lazy(() => import("./pages/LoginPage.jsx"));
// const RegisterPage      = lazy(() => import("./pages/RegisterPage.jsx"));
// const ProfilePage       = lazy(() => import("./pages/ProfilePage.jsx"));
// const SeekerDashboard   = lazy(() => import("./pages/SeekerDashboard.jsx"));
// const ReferrerDashboard = lazy(() => import("./pages/ReferrerDashboard.jsx"));
// const AdminPage         = lazy(() => import("./pages/AdminPage.jsx"));
// const LeaderboardPage   = lazy(() => import("./pages/LeaderboardPage.jsx"));
// const VerifyEmailPage   = lazy(() => import("./pages/VerifyEmailPage.jsx"));
// const FindReferralsPage = lazy(() => import("./pages/FindReferralsPage.jsx"));
// const MyApplicationsPage = lazy(() => import("./pages/MyApplicationsPage.jsx"));
// const TermsPage         = lazy(() => import("./pages/TermsPage.jsx"));
// const PrivacyPage       = lazy(() => import("./pages/PrivacyPage.jsx"));
// const CookiesPage          = lazy(() => import("./pages/CookiesPage.jsx"));
// const ForgotPasswordPage   = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
// const ResetPasswordPage    = lazy(() => import("./pages/ResetPasswordPage.jsx"));

// export default function App() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectCurrentUser);
//   const [checking, setChecking] = useState(true);
//   const didRun = useRef(false);

//   useEffect(() => {
//     if (didRun.current) return;
//     didRun.current = true;

//     fetch("/api/auth/refresh", {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((res) => (res.ok ? res.json() : null))
//       .then((data) => {
//         if (data?.accessToken) dispatch(setCredentials(data));
//         else dispatch(setInitialized());
//       })
//       .catch(() => dispatch(setInitialized()))
//       .finally(() => setChecking(false));
//   }, [dispatch]);

//   if (checking) return <PageLoader />;

//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             fontFamily: "DM Sans, sans-serif",
//             fontSize: "14px",
//             borderRadius: "10px",
//             boxShadow: "0 4px 24px rgba(15,14,23,0.12)",
//           },
//         }}
//       />
//       <CookieBanner />
//       <Suspense fallback={<PageLoader />}>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/leaderboard" element={<LeaderboardPage />} />
//           <Route path="/verify-email"    element={<VerifyEmailPage />} />
//           <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
//           <Route path="/reset-password"   element={<ResetPasswordPage />} />
//           <Route path="/terms"        element={<TermsPage />} />
//           <Route path="/privacy"      element={<PrivacyPage />} />
//           <Route path="/cookies"      element={<CookiesPage />} />
//           <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
//           <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

//           <Route element={<ProtectedRoute />}>
//             <Route element={<AppLayout />}>
//               <Route path="/profile"          element={<ProfilePage />} />
//               <Route path="/find-referrals"  element={<FindReferralsPage />} />
//               <Route path="/my-applications" element={<MyApplicationsPage />} />
//               <Route path="/dashboard" element={user?.roleMode === "referrer" ? <ReferrerDashboard /> : <SeekerDashboard />} />
//               <Route path="/admin" element={user?.isAdmin ? <AdminPage /> : <Navigate to="/dashboard" replace />} />
//             </Route>
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { selectIsAuthenticated, selectCurrentUser } from "./features/auth/authSlice.js";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import CookieBanner from "./components/shared/CookieBanner.jsx";
import PageLoader from "./components/ui/PageLoader.jsx";

const LandingPage       = lazy(() => import("./pages/LandingPage.jsx"));
const LoginPage         = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage      = lazy(() => import("./pages/RegisterPage.jsx"));
const ProfilePage       = lazy(() => import("./pages/ProfilePage.jsx"));
const SeekerDashboard   = lazy(() => import("./pages/SeekerDashboard.jsx"));
const ReferrerDashboard = lazy(() => import("./pages/ReferrerDashboard.jsx"));
const AdminPage         = lazy(() => import("./pages/AdminPage.jsx"));
const LeaderboardPage   = lazy(() => import("./pages/LeaderboardPage.jsx"));
const VerifyEmailPage   = lazy(() => import("./pages/VerifyEmailPage.jsx"));
const FindReferralsPage = lazy(() => import("./pages/FindReferralsPage.jsx"));
const MyApplicationsPage = lazy(() => import("./pages/MyApplicationsPage.jsx"));
const TermsPage         = lazy(() => import("./pages/TermsPage.jsx"));
const PrivacyPage       = lazy(() => import("./pages/PrivacyPage.jsx"));
const CookiesPage          = lazy(() => import("./pages/CookiesPage.jsx"));
const ForgotPasswordPage   = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
const ResetPasswordPage    = lazy(() => import("./pages/ResetPasswordPage.jsx"));

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);


  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
            boxShadow: "0 4px 24px rgba(15,14,23,0.12)",
          },
        }}
      />
      <CookieBanner />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/verify-email"    element={<VerifyEmailPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/reset-password"   element={<ResetPasswordPage />} />
          <Route path="/terms"        element={<TermsPage />} />
          <Route path="/privacy"      element={<PrivacyPage />} />
          <Route path="/cookies"      element={<CookiesPage />} />
          <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/profile"          element={<ProfilePage />} />
              <Route path="/find-referrals"  element={<FindReferralsPage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
              <Route path="/dashboard" element={user?.roleMode === "referrer" ? <ReferrerDashboard /> : <SeekerDashboard />} />
              <Route path="/admin" element={user?.isAdmin ? <AdminPage /> : <Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}