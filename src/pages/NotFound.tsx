import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-base px-4 text-center text-slate-100">
      <div>
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-2 text-slate-400">Page not found.</p>
        <Link to="/" className="mt-4 inline-block text-accent">
          Return Home
        </Link>
      </div>
    </div>
  );
}
