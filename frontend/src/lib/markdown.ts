import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

/** Render markdown to sanitized HTML safe for dangerouslySetInnerHTML. */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md ?? '', { async: false }) as string;
  return DOMPurify.sanitize(html);
}
