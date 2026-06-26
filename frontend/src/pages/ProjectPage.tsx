import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { API } from '@shiplog/shared';
import { ApiError } from '../lib/api';
import { useProject } from '../hooks/useProjects';
import { useEntries } from '../hooks/useEntries';
import { useGenerate } from '../hooks/useGenerate';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { EntryCard } from '../components/entries/EntryCard';

export function ProjectPage() {
  const { id = '' } = useParams();
  const projectQuery = useProject(id);
  const entriesQuery = useEntries(id);
  const generate = useGenerate(id);

  if (projectQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  if (projectQuery.isError || !projectQuery.data) {
    return <p className="text-sm text-slate-600">Project not found.</p>;
  }
  const project = projectQuery.data;

  const genError = generate.error instanceof ApiError ? generate.error : null;
  const reauthNeeded = genError?.code === 'GITHUB_REAUTH_REQUIRED';
  const entries = entriesQuery.data ?? [];

  return (
    <div>
      <Helmet>
        <title>{project.displayName ?? project.repoName} — ShipLog</title>
      </Helmet>

      <Link to="/app" className="text-sm text-slate-500 hover:underline">
        ← All projects
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {project.displayName ?? project.repoName}
          </h1>
          <p className="text-sm text-slate-500">{project.repoFullName}</p>
        </div>
        <div className="flex gap-2">
          <a href={`/${project.slug}`} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm">
              View public page ↗
            </Button>
          </a>
          <Link to={`/app/projects/${project.id}/settings`}>
            <Button variant="secondary" size="sm">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Changelog entries</h2>
          <p className="text-sm text-slate-500">
            Generate drafts from recent GitHub activity, then review and publish them.
          </p>
        </div>
        <Button onClick={() => generate.mutate(undefined)} disabled={generate.isPending}>
          {generate.isPending ? 'Generating…' : 'Generate from GitHub'}
        </Button>
      </div>

      {generate.isPending && (
        <p className="mt-3 text-sm text-slate-500">
          Reading GitHub and writing your release notes — this can take up to a minute.
        </p>
      )}

      {reauthNeeded && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          We need you to reconnect your GitHub account.{' '}
          <a href={API.authGithub} className="font-medium underline">
            Reconnect GitHub
          </a>
        </div>
      )}

      {genError && !reauthNeeded && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {genError.message}
        </div>
      )}

      {generate.data?.reused && !generate.isPending && !genError && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          No new changes since the last generation.
        </div>
      )}

      <div className="mt-5">
        {entriesQuery.isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-6 w-6" />
          </div>
        )}

        {!entriesQuery.isLoading && entries.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            No entries yet. Click <span className="font-medium">Generate from GitHub</span> to create
            your first drafts.
          </div>
        )}

        {entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                to={`/app/projects/${project.id}/entries/${entry.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
