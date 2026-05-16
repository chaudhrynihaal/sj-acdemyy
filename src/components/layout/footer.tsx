import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-20 sm:px-6 md:grid-cols-4 lg:px-16">
        <div className="md:col-span-1">
          <div className="font-display mb-6 text-xl font-bold text-white">
            SJ Academy
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Excellence in English and Sociology. Professional academic support
            for tomorrow&apos;s leaders.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-600">
          <Link href="/tuitions" className="hover:text-amber-600">
            Tuitions
          </Link>
          <Link href="/workshops" className="hover:text-amber-600">
            Workshops
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

      <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-8 sm:px-6 lg:px-16">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} SJ Academy. Excellence in English and
          Sociology.
        </p>
      </div>
    </footer>
  );
}
