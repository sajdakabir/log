import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FullScreenSpinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

const ERROR_MESSAGES: Record<string, string> = {
  github_not_configured:
    'GitHub OAuth isn’t configured on the server yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to backend/.env.',
  state_mismatch: 'The sign-in request expired or could not be verified. Please try again.',
  missing_code_or_state: 'The sign-in response was incomplete. Please try again.',
  oauth_failed: 'We couldn’t complete sign-in with GitHub. Please try again.',
  access_denied: 'You declined the GitHub authorization.',
};

export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const error = params.get('error');
  const navigate = useNavigate();
  const { user, isLoading, refetch } = useAuth();

  // The callback set the session cookies server-side; re-read /api/me to pick them up.
  useEffect(() => {
    if (!error) void refetch();
  }, [error, refetch]);

  useEffect(() => {
    if (!error && !isLoading && user) navigate('/app', { replace: true });
  }, [error, isLoading, user, navigate]);

  if (error) {
    const message = ERROR_MESSAGES[error] ?? 'Sign-in failed. Please try again.';
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-2xl font-bold text-slate-900">Sign-in failed</p>
        <p className="max-w-md text-sm text-slate-600">{message}</p>
        <Link to="/login">
          <Button variant="secondary">Back to sign in</Button>
        </Link>
      </div>
    );
  }

  return <FullScreenSpinner label="Finishing sign-in…" />;
}
