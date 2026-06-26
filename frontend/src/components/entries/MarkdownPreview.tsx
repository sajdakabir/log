import { useMemo } from 'react';
import { renderMarkdown } from '../../lib/markdown';
import { cn } from '../../lib/cn';

export function MarkdownPreview({ markdown, className }: { markdown: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);
  return <div className={cn('md-body', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
