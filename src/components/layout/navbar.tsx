import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tuitions", label: "Tuitions" },
  { href: "/blogs", label: "Blogs" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-16">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-navy"
        >
          SJ Academy
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-widest text-slate-600 transition-colors hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/tuitions"
            className="hidden text-xs font-semibold uppercase tracking-widest text-navy transition-all hover:bg-slate-50 lg:block px-4 py-2 rounded"
          >
            Free Demo
          </Link>
          <Link
            href="/tuitions"
            className={cn(
              "rounded-lg bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:scale-[1.02] hover:opacity-90 hover:shadow-lg active:scale-[0.99]",
            )}
          >
            Enrol Now
          </Link>
        </div>
      </div>
    </header>
  );
}
