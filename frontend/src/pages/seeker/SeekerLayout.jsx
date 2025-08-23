import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../hooks/useAuth';

export default function SeekerLayout() {
  const { data: user, isLoading } = useProfile();
  if (isLoading) return <p className="p-4">Loading…</p>;
  return user?.roles?.includes('seeker') ? <Outlet /> : <Navigate to="/" replace />;
}