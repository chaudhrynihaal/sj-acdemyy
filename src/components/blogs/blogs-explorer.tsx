"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { BlogListItem } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Input } from "@/components/ui/input";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogsExplorer({ blogs }: { blogs: BlogListItem[] }) {
  const [q, setQ] = useState("");
  const [activeAuthor, setActiveAuthor] = useState<string | null>(null);

  const authors = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.author))).sort(),
    [blogs],
  );

  const filtered = useMemo(() => {
    let list = activeAuthor
      ? blogs.filter((b) => b.author === activeAuthor)
      : blogs;
    const s = q.trim().toLowerCase();
    if (s)
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s),
      );
    return list;
  }, [blogs, q, activeAuthor]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <FadeInUp>
            <p className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
              From Our Tutors
            </p>
            <h1 className="font-display mb-4 text-4xl font-bold text-navy sm:text-5xl">
              Learning Resources
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-institutional-grey">
              Articles, guides, and downloads from our tutors — curated for
              serious students.
            </p>
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title or author..."
                className="pl-12"
                aria-label="Search blogs"
              />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">

          {/* Author chips */}
          {authors.length > 0 && (
            <FadeInUp>
              <div className="mb-10 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAuthor(null)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    activeAuthor === null
                      ? "bg-navy text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-navy hover:text-navy"
                  }`}
                >
                  All
                </button>
                {authors.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActiveAuthor(a === activeAuthor ? null : a)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      activeAuthor === a
                        ? "bg-navy text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-navy hover:text-navy"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </FadeInUp>
          )}

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-slate-500">
                No posts match your search.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Try a different keyword or clear the filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b, i) => (
                <FadeInUp key={b.id} delay={Math.min(i * 0.04, 0.2)}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                    <div className="flex flex-grow flex-col border-t-4 border-gold p-8">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        {formatDate(b.published_at)}
                      </p>
                      <h2 className="font-display mt-3 text-xl font-bold leading-snug text-navy">
                        {b.title}
                      </h2>
                      <p className="mt-1 text-sm text-institutional-grey">
                        By {b.author}
                      </p>
                      {b.excerpt ? (
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                          {b.excerpt}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                          href={`/blogs/${b.slug}`}
                          className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                        >
                          Read More
                        </Link>
                        {b.file_url ? (
                          <a
                            href={b.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-navy hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                            Attachment
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
