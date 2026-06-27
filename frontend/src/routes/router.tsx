import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { AuthCallbackPage } from '../pages/AuthCallbackPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ConnectRepoPage } from '../pages/ConnectRepoPage';
import { ProjectPage } from '../pages/ProjectPage';
import { EntryEditPage } from '../pages/EntryEditPage';
import { ProjectSettingsPage } from '../pages/ProjectSettingsPage';
import { PublicChangelogPage } from '../pages/PublicChangelogPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

// The public /{slug} changelog route is added in M5 and must stay before the catch-all.
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/app', element: <DashboardPage /> },
          { path: '/app/connect', element: <ConnectRepoPage /> },
          { path: '/app/projects/:id', element: <ProjectPage /> },
          { path: '/app/projects/:id/entries/:entryId', element: <EntryEditPage /> },
          { path: '/app/projects/:id/settings', element: <ProjectSettingsPage /> },
        ],
      },
    ],
  },
  // Public hosted changelog. Static routes above rank higher than this dynamic
  // single-segment route; the catch-all stays last.
  { path: '/:slug', element: <PublicChangelogPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
