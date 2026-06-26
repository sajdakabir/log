import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../hooks/useLogout';
import { Button } from '../ui/Button';

export function AppShell() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/app" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-white">≡</span>
            ShipLog
          </Link>
          <div className="flex items-center gap-3">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full border border-slate-200" />
            )}
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user?.name ?? user?.githubLogin}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
