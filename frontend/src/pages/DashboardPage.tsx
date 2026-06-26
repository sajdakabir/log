import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export function DashboardPage() {
  const projectsQuery = useProjects();
  const projects = projectsQuery.data ?? [];

  return (
    <div>
      <Helmet>
        <title>Dashboard — ShipLog</title>
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
        <Link to="/app/connect">
          <Button>Connect a repo</Button>
        </Link>
      </div>

      {projectsQuery.isLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {!projectsQuery.isLoading && projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">No projects connected yet.</p>
          <Link to="/app/connect" className="mt-4 inline-block">
            <Button>Connect your first repo</Button>
          </Link>
        </div>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
