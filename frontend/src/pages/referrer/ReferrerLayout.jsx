import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth';

export default function ReferrerLayout() {
  const { data: user, isLoading } = useProfile();
  if (isLoading) return <p className="p-4">Loading…</p>;
  return user?.roles?.includes('referrer') ? <Outlet /> : <Navigate to="/" replace />;
}