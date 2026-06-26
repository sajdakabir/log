import { Link } from 'react-router-dom';
import type { EntryDTO } from '@shiplog/shared';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChangeTypeBadge } from './ChangeTypeBadge';

export function EntryCard({ entry, to }: { entry: EntryDTO; to?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Badge tone="slate">{entry.version}</Badge>
        {entry.status === 'PUBLISHED' ? (
          <Badge tone="green">Published</Badge>
        ) : (
          <Badge tone="amber">Draft</Badge>
        )}
      </div>

      <div className="mt-2">
        {to ? (
          <Link to={to} className="font-semibold text-slate-900 hover:text-brand-600">
            {entry.title}
          </Link>
        ) : (
          <span className="font-semibold text-slate-900">{entry.title}</span>
        )}
      </div>

      {entry.summary && <p className="mt-1 text-sm text-slate-600">{entry.summary}</p>}

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
    </Card>
  );
}
