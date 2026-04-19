import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-300/80">404</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-slate-400">The page you requested does not exist.</p>
        <Link
          to="/home"
          className="mt-5 inline-block rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
