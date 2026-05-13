import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Tuitions" },
  { href: "/blogs", label: "Blogs" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-amber-500 shadow-md">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg tracking-tight">SJ Academy</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-amber-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-navy"
          >
            Admin
          </Link>
          <Link
            href="/tuitions"
            className={cn(
              "rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-slate-800 hover:shadow-lg",
            )}
          >
            Enrol Now
          </Link>
        </div>
      </div>
    </header>
  );
}
