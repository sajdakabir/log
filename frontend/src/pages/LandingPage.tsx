import { Helmet } from 'react-helmet-async';
import { API } from '@shiplog/shared';
import { Button } from '../components/ui/Button';

const FEATURES = [
  {
    title: 'Written for your users',
    body: 'ShipLog rewrites raw commits and PRs into clear, jargon-free release notes people actually read.',
  },
  {
    title: 'Connected to GitHub',
    body: 'Sign in with GitHub, pick a public repo, and pull in merged PRs, commits, and release tags on demand.',
  },
  {
    title: 'Grouped by version',
    body: 'Entries are bucketed by release tag and tagged Added / Improved / Fixed / Removed automatically.',
  },
  {
    title: 'You stay in control',
    body: 'Everything lands as a draft. Review, edit, and only then publish — nothing ships without your say-so.',
  },
  {
    title: 'Hosted changelog page',
    body: 'Every project gets a clean public page at /your-project that you can share with anyone.',
  },
  {
    title: 'No busywork',
    body: 'Re-running generation is idempotent — it never duplicates entries or re-bills when nothing changed.',
  },
];

const STEPS = [
  { n: 1, title: 'Connect GitHub', body: 'Authorize ShipLog to read your public repositories.' },
  { n: 2, title: 'Pick a repo', body: 'Choose the project you want a changelog for.' },
  { n: 3, title: 'Generate', body: 'AI turns recent activity into draft release notes.' },
  { n: 4, title: 'Review & publish', body: 'Tweak the drafts, then publish to your hosted page.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>ShipLog — Your changelog, written for you</title>
      </Helmet>

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">≡</span>
          ShipLog
        </div>
        <a href={API.authGithub}>
          <Button variant="secondary" size="sm">
            Sign in with GitHub
          </Button>
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          AI-powered changelogs
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Your changelog, <span className="text-brand-600">written for you</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          ShipLog reads your GitHub history and turns messy commits and pull requests into clean,
          user-friendly release notes — ready to review and publish.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href={API.authGithub}>
            <Button size="lg">Start with GitHub</Button>
          </a>
          <a href="/demo">
            <Button variant="ghost" size="lg">
              View a live demo →
            </Button>
          </a>
        </div>
      </section>

      {/* Before / after */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-sm text-slate-300">
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Raw git history</p>
            <p>fix: npe on export when list empty</p>
            <p>feat(ui): dark mode toggle wip</p>
            <p>chore: bump deps</p>
            <p>refactor search index lookups</p>
          </div>
          <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-5 text-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
              ShipLog release notes
            </p>
            <p className="font-semibold text-slate-900">v1.2.0 — Dark mode &amp; faster search</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>✨ Added a dark mode toggle in settings</li>
              <li>⚡ Search is noticeably faster on large projects</li>
              <li>🐛 Fixed a crash when exporting an empty changelog</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl font-bold text-slate-900">Everything you need to ship notes</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl bg-slate-50 p-6">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Stop writing changelogs by hand</h2>
        <p className="mt-3 text-slate-600">Connect a repo and have your first draft in under a minute.</p>
        <div className="mt-7">
          <a href={API.authGithub}>
            <Button size="lg">Start with GitHub</Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        ShipLog — a clone built as a lean MVP.
      </footer>
    </div>
  );
}
