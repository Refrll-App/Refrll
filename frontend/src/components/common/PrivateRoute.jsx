


import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ allowedRoles }) {
  const { data: user, isLoading, isError, error } = useProfile();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (isLoading) return <LoadingSpinner/>;

  // If user not logged in or error/unauthorized, redirect to login
  if (!user || isError || error?.response?.status === 401 || !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is set, check if user has any role in allowedRoles
  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  // User is authorized, render nested routes
  return <Outlet />;
}
