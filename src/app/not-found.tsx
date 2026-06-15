import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
        404
      </p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
      >
        Back to home
      </Link>
    </main>
  );
}
