import { useState } from 'react';
import type { GithubRepoDTO } from '@shiplog/shared';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface Props {
  repos: GithubRepoDTO[];
  onConnect: (repo: GithubRepoDTO) => void;
  connectingId: number | null;
  connectedFullNames: Set<string>;
}

export function RepoPicker({ repos, onConnect, connectingId, connectedFullNames }: Props) {
  const [query, setQuery] = useState('');
  const filtered = repos.filter((r) => r.fullName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Input
        placeholder="Search your repositories…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No matching repositories.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((repo) => {
            const connected = connectedFullNames.has(repo.fullName);
            return (
              <Card key={repo.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{repo.fullName}</p>
                  {repo.description && (
                    <p className="truncate text-sm text-slate-500">{repo.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={connected ? 'ghost' : 'primary'}
                  disabled={connected || connectingId === repo.id}
                  onClick={() => onConnect(repo)}
                >
                  {connected ? 'Connected' : connectingId === repo.id ? 'Connecting…' : 'Connect'}
                </Button>
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
