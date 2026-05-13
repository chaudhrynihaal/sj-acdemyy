import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-muted py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold text-navy">SJ Academy</p>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Excellence in English Language and Sociology — online and in Faisalabad.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-600">
          <Link href="/tuitions" className="hover:text-amber-600">
            Tuitions
          </Link>
          <Link href="/blogs" className="hover:text-amber-600">
            Blogs
          </Link>
          <Link href="/resources" className="hover:text-amber-600">
            Resources
          </Link>
          <a
            href="mailto:admissions@sjacademy.com"
            className="hover:text-amber-600"
          >
            admissions@sjacademy.com
          </a>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SJ Academy. All rights reserved.
      </p>
    </footer>
  );
}
