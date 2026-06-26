import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { AuthCallbackPage } from '../pages/AuthCallbackPage';
import { DashboardPage } from '../pages/DashboardPage';
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
        children: [{ path: '/app', element: <DashboardPage /> }],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
