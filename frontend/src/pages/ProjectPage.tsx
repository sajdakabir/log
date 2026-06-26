import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export function ProjectPage() {
  const { id = '' } = useParams();
  const projectQuery = useProject(id);

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

      {/* Generate (M3) + entry review (M4) render here. */}
      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        Changelog generation and entry review are coming up next.
      </div>
    </div>
  );
}
