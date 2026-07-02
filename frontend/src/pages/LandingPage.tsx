import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { API } from '@shiplog/shared';
import { ChangeTypeBadge } from '../components/entries/ChangeTypeBadge';

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
        ≡
      </span>
      <span
        className={`font-display text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}
      >
        ShipLog
      </span>
    </span>
  );
}

function GithubMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const FEATURES = [
  {
    title: 'Written for your users',
    body: 'Raw commits and PRs become clear, jargon-free release notes people actually read.',
    icon: (
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    ),
  },
  {
    title: 'Connected to GitHub',
    body: 'Sign in, pick a public repo, and pull merged PRs, commits, and release tags on demand.',
    icon: (
      <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    ),
  },
  {
    title: 'Grouped by version',
    body: 'Entries bucket under release tags and get typed Added, Improved, Fixed, or Removed.',
    icon: (
      <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z M6 6h.008v.008H6V6Z" />
    ),
  },
  {
    title: 'You stay in control',
    body: 'Everything lands as a draft. Review, edit, and only then publish — nothing ships without you.',
    icon: (
      <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    ),
  },
  {
    title: 'Hosted public page',
    body: 'Every project gets a clean changelog at /your-project — share the link anywhere.',
    icon: (
      <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    ),
  },
  {
    title: 'Never bills twice',
    body: 'Regeneration is idempotent — no duplicate entries, no wasted AI spend when nothing changed.',
    icon: (
      <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    ),
  },
];

const STEPS = [
  { n: '01', title: 'Connect GitHub', body: 'Authorize read access to your public repositories.' },
  { n: '02', title: 'Pick a repo', body: 'Choose the project that needs a changelog.' },
  { n: '03', title: 'Generate', body: 'AI turns recent activity into draft release notes.' },
  { n: '04', title: 'Review & publish', body: 'Polish the drafts, then push them live.' },
];

const TERMINAL_LINES = [
  { sha: 'a1f3c92', msg: 'fix: npe on export when list empty' },
  { sha: '7d2e410', msg: 'feat(ui): dark mode toggle wip' },
  { sha: 'c4b81aa', msg: 'chore: bump deps' },
  { sha: '9e0f2d3', msg: 'refactor: search index lookups' },
  { sha: '5b7c6e1', msg: 'Merge pull request #182 from feat/dm' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>ShipLog — Your changelog, written for you</title>
      </Helmet>

      {/* ── Dark hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-950 pb-44">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[128px]"
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px]"
          aria-hidden="true"
        />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo dark />
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="/demo" className="transition hover:text-white">
              Live demo
            </a>
          </nav>
          <a
            href={API.authGithub}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          >
            <GithubMark />
            Sign in
          </a>
        </header>

        <section className="relative mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            AI release notes, straight from your git history
          </span>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Your changelog,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              written for you.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            ShipLog reads your commits and pull requests, then writes the clean, user-friendly
            release notes your users deserve — you just review and hit publish.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={API.authGithub}
              className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-white px-7 text-sm font-semibold text-slate-950 shadow-xl shadow-indigo-950/40 transition hover:bg-indigo-50"
            >
              <GithubMark className="h-5 w-5" />
              Start with GitHub
            </a>
            <a
              href="/demo"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 px-7 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              See a live changelog
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Free while in beta · Public repos only · No card required
          </p>
        </section>
      </div>

      {/* ── Before / after visual (overlaps the hero) ─────────── */}
      <section className="relative z-10 mx-auto -mt-32 max-w-5xl px-6">
        <div className="grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]">
          {/* terminal */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/50">
            <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-slate-500">git log --oneline</span>
            </div>
            <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
              {TERMINAL_LINES.map((l) => (
                <p key={l.sha} className="truncate">
                  <span className="text-amber-400/80">{l.sha}</span>{' '}
                  <span className="text-slate-400">{l.msg}</span>
                </p>
              ))}
              <p className="text-slate-600">…46 more commits</p>
            </div>
          </div>

          {/* arrow */}
          <div className="hidden items-center md:flex" aria-hidden="true">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-indigo-100 bg-white text-indigo-600 shadow-lg shadow-indigo-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          {/* changelog card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 font-mono text-xs font-semibold text-white">
                v1.2.0
              </span>
              <span className="text-xs text-slate-400">June 10, 2026</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-slate-900">
              Dark mode &amp; faster search
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <ChangeTypeBadge type="Added" />
                <span>Dark mode toggle in settings</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ChangeTypeBadge type="Improved" />
                <span>Search is up to 3× faster on large projects</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ChangeTypeBadge type="Fixed" />
                <span>Crash when exporting an empty changelog</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-8 pt-28">
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">
          Features
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Everything you need to ship notes
        </h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-white p-7 transition hover:bg-slate-50">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 font-display font-semibold tracking-tight text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">
          How it works
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          From git log to changelog in a minute
        </h2>
        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block"
            aria-hidden="true"
          />
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <div className="inline-grid h-10 w-10 place-items-center rounded-full border border-indigo-100 bg-white font-mono text-xs font-bold text-indigo-600 shadow-sm">
                {s.n}
              </div>
              <h3 className="mt-4 font-display font-semibold tracking-tight text-slate-900">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-20 text-center">
          <div
            className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-indigo-600/40 blur-[100px]"
            aria-hidden="true"
          />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop writing changelogs by hand
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-slate-400">
            Connect a repo and get your first AI-written draft in under a minute.
          </p>
          <a
            href={API.authGithub}
            className="relative mt-9 inline-flex h-12 items-center gap-2.5 rounded-xl bg-white px-7 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
          >
            <GithubMark className="h-5 w-5" />
            Start with GitHub
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <Logo />
          <p className="text-sm text-slate-400">Turn shipped code into stories users read.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="/demo" className="transition hover:text-slate-900">
              Demo
            </a>
            <Link to="/login" className="transition hover:text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
