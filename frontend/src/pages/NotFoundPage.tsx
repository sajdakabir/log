import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link to="/" className="text-brand-600 hover:underline">
        Back home
      </Link>
    </div>
  );
}
