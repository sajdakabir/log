import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import { API } from '@shiplog/shared';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { FullScreenSpinner } from '../components/ui/Spinner';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LoginPage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullScreenSpinner />;
  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <Helmet>
        <title>Sign in — ShipLog</title>
      </Helmet>
      <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-extrabold tracking-tight">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">≡</span>
        ShipLog
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold text-slate-900">Welcome to ShipLog</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Sign in to connect a repo and generate your changelog.
        </p>
        <a href={API.authGithub} className="mt-6 block">
          <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800">
            <GithubIcon />
            Continue with GitHub
          </Button>
        </a>
        <p className="mt-4 text-center text-xs text-slate-400">
          We only request access to your public repositories.
        </p>
      </div>
    </div>
  );
}
