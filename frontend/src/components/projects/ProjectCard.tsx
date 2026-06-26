import { Link } from 'react-router-dom';
import type { ProjectDTO } from '@shiplog/shared';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to={`/app/projects/${project.id}`}
            className="font-semibold text-slate-900 hover:text-brand-600"
          >
            {project.displayName ?? project.repoName}
          </Link>
          <p className="truncate text-xs text-slate-500">{project.repoFullName}</p>
        </div>
        {!project.isPublic && <Badge tone="amber">Hidden</Badge>}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <a
          href={`/${project.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-brand-600 hover:underline"
        >
          /{project.slug} ↗
        </a>
        <div className="flex gap-2">
          <Link to={`/app/projects/${project.id}/settings`}>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </Link>
          <Link to={`/app/projects/${project.id}`}>
            <Button variant="secondary" size="sm">
              Open
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
