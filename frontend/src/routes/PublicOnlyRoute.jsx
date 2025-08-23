


import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

export default function PublicOnlyRoute({ children }) {
  const { data: user, isLoading, isError, error } = useProfile({ force: true });
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (isLoading) return null; // or a loader

  // If user is not logged in or error or 401, allow access to public route
  if (!user || isError || error?.response?.status === 401 || !isLoggedIn) {
    return children;
  }

  // User is logged in - redirect based on currentRole
  if (user.currentRole === 'seeker') return <Navigate to="/employee/dashboard" replace />;
  if (user.currentRole === 'referrer') return <Navigate to="/employee/referrer" replace />;
  if (user.currentRole === 'hr') return <Navigate to="/hr/dashboard" replace />;

  // Fallback just in case
  return children;
}
