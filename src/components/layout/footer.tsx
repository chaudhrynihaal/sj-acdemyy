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

        <div>
          <h5 className="mb-6 text-xs font-bold uppercase tracking-wide text-gold">
            Quick Links
          </h5>
          <ul className="space-y-4">
            <li>
              <Link
                href="/tuitions"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Tuitions
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Resources
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-6 text-xs font-bold uppercase tracking-wide text-gold">
            Support
          </h5>
          <ul className="space-y-4">
            <li>
              <Link
                href="/tuitions"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Free Demo
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-6 text-xs font-bold uppercase tracking-wide text-gold">
            Contact
          </h5>
          <p className="text-sm leading-loose text-slate-400">
            Office of Admissions
            <br />
            SJ Academy Campus
            <br />
            <a
              href="mailto:admissions@sjacademy.com"
              className="transition-colors hover:text-white"
            >
              admissions@sjacademy.com
            </a>
          </p>
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
