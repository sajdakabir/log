import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FullScreenSpinner } from './ui/Spinner';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullScreenSpinner label="Loading…" />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
