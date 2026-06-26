import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <Helmet>
        <title>Dashboard — ShipLog</title>
      </Helmet>
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back, {user?.name ?? user?.githubLogin} 👋
      </h1>
      <p className="mt-1 text-slate-600">Your connected projects will appear here.</p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm text-slate-500">No projects connected yet.</p>
        <p className="mt-1 text-xs text-slate-400">
          Connecting a GitHub repo is coming up next.
        </p>
      </div>
    </div>
  );
}
