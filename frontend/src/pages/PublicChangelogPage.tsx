import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { API, type PublicChangelogDTO } from '@shiplog/shared';
import { api, ApiError } from '../lib/api';
import { FullScreenSpinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { ChangeTypeBadge } from '../components/entries/ChangeTypeBadge';
import { MarkdownPreview } from '../components/entries/MarkdownPreview';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PublicChangelogPage() {
  const { slug = '' } = useParams();
  const query = useQuery<PublicChangelogDTO>({
    queryKey: ['public-changelog', slug],
    queryFn: () => api.get<PublicChangelogDTO>(API.publicChangelog(slug)),
    retry: false,
  });

  if (query.isLoading) return <FullScreenSpinner />;

  if (query.isError || !query.data) {
    const notFound = query.error instanceof ApiError && query.error.status === 404;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {notFound ? 'Changelog not found' : 'Something went wrong'}
        </h1>
        <Link to="/" className="text-brand-600 hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  const { project, versions } = query.data;
  const title = project.displayName ?? project.repoFullName;

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{title} — Changelog</title>
        <meta
          name="description"
          content={project.description ?? `Changelog for ${project.repoFullName}`}
        />
        <meta property="og:title" content={`${title} — Changelog`} />
        {project.description && <meta property="og:description" content={project.description} />}
      </Helmet>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
          {project.description && <p className="mt-2 text-slate-600">{project.description}</p>}
        </header>

        {versions.length === 0 ? (
          <p className="text-slate-500">No published changelog entries yet.</p>
        ) : (
          <div className="space-y-10">
            {versions.flatMap((v) =>
              v.entries.map((entry) => (
                <article key={entry.id} className="border-l-2 border-slate-200 pl-6">
                  <div className="flex items-center gap-3">
                    <Badge tone="brand">{entry.version}</Badge>
                    {entry.publishedAt && (
                      <time className="text-xs text-slate-400">{formatDate(entry.publishedAt)}</time>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{entry.title}</h2>
                  {entry.summary && <p className="mt-1 text-slate-600">{entry.summary}</p>}
                  {entry.changes && entry.changes.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {entry.changes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <ChangeTypeBadge type={c.type} />
                          <span>{c.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {entry.bodyMarkdown && <MarkdownPreview markdown={entry.bodyMarkdown} className="mt-3" />}
                </article>
              )),
            )}
          </div>
        )}

        <footer className="mt-16 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          Powered by ShipLog
        </footer>
      </div>
    </div>
  );
}
