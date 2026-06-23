"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Tuitions" },
  { href: "/workshops", label: "Workshops" },
  { href: "/blogs", label: "Blogs" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-navy"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-amber-500 shadow-md">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg tracking-tight">SJ Academy</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-amber-600",
                pathname === l.href ? "text-amber-600" : "text-slate-600",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/tuitions"
            className="hidden rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-slate-800 hover:shadow-lg md:inline-flex"
          >
            Enroll Now
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-amber-600",
                    pathname === l.href
                      ? "bg-amber-50 text-amber-600"
                      : "text-slate-700",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/tuitions"
            onClick={() => setOpen(false)}
            className="mt-4 block w-full rounded-full bg-navy py-3 text-center text-sm font-semibold text-white shadow-md"
          >
            Enroll Now
          </Link>
        </nav>
      )}
    </header>
  );
}
