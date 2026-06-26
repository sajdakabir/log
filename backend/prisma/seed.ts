import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_GITHUB_ID = 0;
const DEMO_REPO_ID = 0;

async function main() {
  const user = await prisma.user.upsert({
    where: { githubId: DEMO_GITHUB_ID },
    update: {},
    create: {
      githubId: DEMO_GITHUB_ID,
      githubLogin: 'demo',
      name: 'ShipLog Demo',
      email: 'demo@shiplog.local',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
  });

  const project = await prisma.project.upsert({
    where: { userId_githubRepoId: { userId: user.id, githubRepoId: DEMO_REPO_ID } },
    update: {},
    create: {
      userId: user.id,
      githubRepoId: DEMO_REPO_ID,
      repoOwner: 'shiplog',
      repoName: 'demo',
      repoFullName: 'shiplog/demo',
      defaultBranch: 'main',
      slug: 'demo',
      displayName: 'ShipLog Demo',
      description: 'A sample changelog so the public page renders without connecting GitHub.',
      isPublic: true,
    },
  });

  const entries: Array<{
    version: string;
    title: string;
    summary: string;
    bodyMarkdown: string;
    changes: Prisma.InputJsonValue;
    status: 'DRAFT' | 'PUBLISHED';
    publishedAt: Date | null;
    sortOrder: number;
  }> = [
    {
      version: 'v1.2.0',
      title: 'Dark mode & faster search',
      summary: 'A long-awaited dark theme plus a much snappier search experience.',
      bodyMarkdown:
        '## v1.2.0\n\n- **Dark mode** is here — toggle it from settings.\n- Search is now up to 3× faster on large projects.\n- Fixed a bug where exporting an empty changelog could crash.',
      changes: [
        { type: 'Added', text: 'Dark mode toggle in settings' },
        { type: 'Improved', text: 'Search is up to 3× faster on large projects' },
        { type: 'Fixed', text: 'Crash when exporting an empty changelog' },
      ],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-10T10:00:00Z'),
      sortOrder: 0,
    },
    {
      version: 'v1.1.0',
      title: 'Custom domains & embeds',
      summary: 'Host your changelog on your own domain and embed it anywhere.',
      bodyMarkdown:
        '## v1.1.0\n\n- Connect a **custom domain** to your hosted changelog.\n- New embeddable widget for in-app changelogs.\n- Improved onboarding copy.',
      changes: [
        { type: 'Added', text: 'Custom domains for hosted changelogs' },
        { type: 'Added', text: 'Embeddable changelog widget' },
        { type: 'Improved', text: 'Clearer onboarding copy' },
      ],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-05-02T09:00:00Z'),
      sortOrder: 0,
    },
    {
      version: 'Unreleased',
      title: 'Work in progress',
      summary: 'Draft notes that have not been published yet.',
      bodyMarkdown:
        '## Unreleased\n\n- Keyboard shortcuts for the dashboard.\n- Per-project accent colors.',
      changes: [
        { type: 'Added', text: 'Keyboard shortcuts for the dashboard' },
        { type: 'Added', text: 'Per-project accent colors' },
      ],
      status: 'DRAFT',
      publishedAt: null,
      sortOrder: 0,
    },
  ];

  for (const entry of entries) {
    await prisma.changelogEntry.upsert({
      where: { projectId_version: { projectId: project.id, version: entry.version } },
      update: {},
      create: { projectId: project.id, ...entry },
    });
  }

  await prisma.generation.create({
    data: {
      projectId: project.id,
      status: 'DONE',
      fingerprint: 'seed-demo-fingerprint',
      model: 'gpt-4o-mini',
      finishedAt: new Date('2026-06-10T10:00:00Z'),
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded demo user (${user.githubLogin}) + project "/${project.slug}" with ${entries.length} entries.`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
