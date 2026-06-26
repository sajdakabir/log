import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Routes for login, the dashboard, and the public /{slug} page are added in later
// milestones. The catch-all stays last.
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
