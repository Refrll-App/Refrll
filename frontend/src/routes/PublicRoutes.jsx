import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

import NotFoundPage from "../pages/NotFoundPage.jsx";

import AboutPage from "../pages/AboutPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RegisterHrPage from "../pages/RegisterHrPage.jsx";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import TermsAndConditions from "../pages/TermsAndConditions.jsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.jsx";
import ContactUsPage from "../pages/ContactUsPage.jsx";

export default function PublicRoutes() {
  return (
    <Routes>
      {/* Publicly available pages */}
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/about" element={<AboutPage />} /> */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/policy" element={<PrivacyPolicyPage />} />
      <Route path="/contact" element={<ContactUsPage />} />

      {/* 🔐 Protected from logged-in users */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register-hr"
        element={
          <PublicOnlyRoute>
            <RegisterHrPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/about"
        element={
          <PublicOnlyRoute>
            <AboutPage />
          </PublicOnlyRoute>
        }
      />
    </Routes>
  );
}
