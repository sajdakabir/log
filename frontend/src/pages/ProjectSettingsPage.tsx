import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { useDeleteProject, useProject, useUpdateProject } from '../hooks/useProjects';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Label, Textarea } from '../components/ui/Input';

export function ProjectSettingsPage() {
  const { id = '' } = useParams();
  const projectQuery = useProject(id);
  const update = useUpdateProject(id);
  const del = useDeleteProject();
  const navigate = useNavigate();

  const [form, setForm] = useState({ displayName: '', slug: '', description: '', isPublic: true });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = projectQuery.data;
    if (p) {
      setForm({
        displayName: p.displayName ?? '',
        slug: p.slug,
        description: p.description ?? '',
        isPublic: p.isPublic,
      });
    }
  }, [projectQuery.data]);

  if (projectQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  if (!projectQuery.data) return <p className="text-sm text-slate-600">Project not found.</p>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    update.mutate(
      {
        displayName: form.displayName || null,
        slug: form.slug,
        description: form.description || null,
        isPublic: form.isPublic,
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to save'),
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this project and all its changelog entries? This cannot be undone.')) {
      return;
    }
    del.mutate(id, { onSuccess: () => navigate('/app') });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Helmet>
        <title>Settings — ShipLog</title>
      </Helmet>
      <Link to={`/app/projects/${id}`} className="text-sm text-slate-500 hover:underline">
        ← Back to project
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Project settings</h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              placeholder={projectQuery.data.repoName}
            />
          </div>

          <div>
            <Label htmlFor="slug">Public URL slug</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-400">/</span>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Changing the slug breaks any existing links to your changelog.
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            Public changelog page is visible to anyone
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-green-600">Saved.</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6 border-red-200 p-6">
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-600">
          Deleting this project removes it and all generated changelog entries.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={handleDelete}
          disabled={del.isPending}
        >
          {del.isPending ? 'Deleting…' : 'Delete project'}
        </Button>
      </Card>
    </div>
  );
}
