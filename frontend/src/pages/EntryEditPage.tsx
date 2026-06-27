import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CHANGE_TYPES, type ChangeItem, type ChangeType } from '@shiplog/shared';
import { ApiError } from '../lib/api';
import { useDeleteEntry, useEntry, usePublishEntry, useUpdateEntry } from '../hooks/useEntry';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Label, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { MarkdownPreview } from '../components/entries/MarkdownPreview';
import { ChangeTypeBadge } from '../components/entries/ChangeTypeBadge';

export function EntryEditPage() {
  const { id = '', entryId = '' } = useParams();
  const entryQuery = useEntry(id, entryId);
  const update = useUpdateEntry(id, entryId);
  const del = useDeleteEntry(id);
  const publish = usePublishEntry(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', version: '', summary: '', bodyMarkdown: '' });
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const e = entryQuery.data;
    if (e) {
      setForm({ title: e.title, version: e.version, summary: e.summary ?? '', bodyMarkdown: e.bodyMarkdown });
      setChanges(e.changes ?? []);
    }
  }, [entryQuery.data]);

  if (entryQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  if (entryQuery.isError || !entryQuery.data) {
    return <p className="text-sm text-slate-600">Entry not found.</p>;
  }
  const entry = entryQuery.data;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    update.mutate(
      {
        title: form.title,
        version: form.version,
        summary: form.summary || null,
        bodyMarkdown: form.bodyMarkdown,
        changes: changes.filter((c) => c.text.trim()).length ? changes.filter((c) => c.text.trim()) : null,
      },
      {
        onSuccess: () => setSaved(true),
        onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to save'),
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this changelog entry? This cannot be undone.')) return;
    del.mutate(entryId, { onSuccess: () => navigate(`/app/projects/${id}`) });
  };

  const setChange = (i: number, patch: Partial<ChangeItem>) =>
    setChanges((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  return (
    <div className="mx-auto max-w-5xl">
      <Helmet>
        <title>Edit entry — ShipLog</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <Link to={`/app/projects/${id}`} className="text-sm text-slate-500 hover:underline">
          ← Back to project
        </Link>
        {entry.status === 'PUBLISHED' ? (
          <Badge tone="green">Published</Badge>
        ) : (
          <Badge tone="amber">Draft</Badge>
        )}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="One-line summary"
            />
          </div>

          <div>
            <Label>Changes</Label>
            <div className="space-y-2">
              {changes.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={c.type}
                    onChange={(e) => setChange(i, { type: e.target.value as ChangeType })}
                    className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                  >
                    {CHANGE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={c.text}
                    onChange={(e) => setChange(i, { text: e.target.value })}
                    placeholder="Describe the change"
                  />
                  <button
                    type="button"
                    onClick={() => setChanges((cs) => cs.filter((_, idx) => idx !== i))}
                    className="px-2 text-slate-400 hover:text-red-600"
                    aria-label="Remove change"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChanges((cs) => [...cs, { type: 'Added', text: '' }])}
              >
                + Add change
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="body">Body (Markdown)</Label>
            <Textarea
              id="body"
              rows={12}
              value={form.bodyMarkdown}
              onChange={(e) => setForm({ ...form, bodyMarkdown: e.target.value })}
              className="font-mono"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-green-600">Saved.</p>}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Saving…' : 'Save'}
              </Button>
              {entry.status === 'DRAFT' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => publish.mutate(entryId)}
                  disabled={publish.isPending}
                >
                  {publish.isPending ? 'Publishing…' : 'Publish'}
                </Button>
              )}
            </div>
            <Button type="button" variant="danger" onClick={handleDelete} disabled={del.isPending}>
              Delete
            </Button>
          </div>
        </form>

        {/* Live preview */}
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge tone="slate">{form.version || 'Unreleased'}</Badge>
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{form.title || 'Untitled'}</h2>
          {form.summary && <p className="mt-1 text-sm text-slate-600">{form.summary}</p>}
          {changes.filter((c) => c.text.trim()).length > 0 && (
            <ul className="mt-3 space-y-1">
              {changes
                .filter((c) => c.text.trim())
                .map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <ChangeTypeBadge type={c.type} />
                    <span>{c.text}</span>
                  </li>
                ))}
            </ul>
          )}
          <hr className="my-4 border-slate-100" />
          <MarkdownPreview markdown={form.bodyMarkdown} />
        </Card>
      </div>
    </div>
  );
}
