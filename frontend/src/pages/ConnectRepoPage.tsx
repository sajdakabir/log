import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { API, type GithubRepoDTO } from '@shiplog/shared';
import { ApiError } from '../lib/api';
import { useGithubRepos } from '../hooks/useGithubRepos';
import { useCreateProject, useProjects } from '../hooks/useProjects';
import { RepoPicker } from '../components/repos/RepoPicker';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function ConnectRepoPage() {
  const reposQuery = useGithubRepos();
  const projectsQuery = useProjects();
  const createProject = useCreateProject();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<number | null>(null);

  const connectedFullNames = new Set((projectsQuery.data ?? []).map((p) => p.repoFullName));

  const handleConnect = (repo: GithubRepoDTO) => {
    setError(null);
    setConnectingId(repo.id);
    createProject.mutate(
      { githubRepoId: repo.id },
      {
        onSuccess: (project) => navigate(`/app/projects/${project.id}`),
        onError: (err) => {
          setError(err instanceof ApiError ? err.message : 'Failed to connect repository');
          setConnectingId(null);
        },
      },
    );
  };

  const reauthNeeded =
    reposQuery.error instanceof ApiError && reposQuery.error.code === 'GITHUB_REAUTH_REQUIRED';

  return (
    <div>
      <Helmet>
        <title>Connect a repository — ShipLog</title>
      </Helmet>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Connect a repository</h1>
          <p className="text-sm text-slate-600">Pick a public repo to generate a changelog for.</p>
        </div>
        <Link to="/app">
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {reposQuery.isLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {reauthNeeded && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm text-amber-800">
            We need you to reconnect your GitHub account to read your repositories.
          </p>
          <a href={API.authGithub} className="mt-4 inline-block">
            <Button>Reconnect GitHub</Button>
          </a>
        </div>
      )}

      {reposQuery.isError && !reauthNeeded && (
        <p className="text-sm text-red-600">Couldn’t load your repositories. Try again later.</p>
      )}

      {reposQuery.data && (
        <RepoPicker
          repos={reposQuery.data}
          onConnect={handleConnect}
          connectingId={connectingId}
          connectedFullNames={connectedFullNames}
        />
      )}
    </div>
  );
}
