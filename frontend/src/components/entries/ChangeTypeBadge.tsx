import type { ChangeType } from '@shiplog/shared';
import { Badge, type BadgeTone } from '../ui/Badge';

const tones: Record<ChangeType, BadgeTone> = {
  Added: 'green',
  Improved: 'blue',
  Fixed: 'amber',
  Removed: 'red',
};

export function ChangeTypeBadge({ type }: { type: ChangeType }) {
  return <Badge tone={tones[type]}>{type}</Badge>;
}
