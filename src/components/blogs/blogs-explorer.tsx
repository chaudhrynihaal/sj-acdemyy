"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { BlogListItem } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonClass } from "@/components/ui/button";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogsExplorer({ blogs }: { blogs: BlogListItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.author.toLowerCase().includes(s),
    );
  }, [blogs, q]);

  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-muted to-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeInUp>
            <h1 className="text-center text-4xl font-extrabold text-navy sm:text-5xl">
              Blogs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
              Insights, exam tips, and subject guides from our tutors — written to help
              you think clearly and perform confidently.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.08} className="mx-auto mt-10 max-w-xl">
            <div className="relative">
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

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-600">
            No posts match your search. Try a different keyword.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b, i) => (
              <FadeInUp key={b.id} delay={Math.min(i * 0.04, 0.2)}>
                <Card className="flex h-full flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                    {formatDate(b.published_at)}
                  </p>
                  <h2 className="mt-3 text-lg font-bold text-navy">{b.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">By {b.author}</p>
                  {b.excerpt ? (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">
                      {b.excerpt}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/blogs/${b.slug}`} className={buttonClass("primary")}>
                      Read More
                    </Link>
                    {b.file_url ? (
                      <a
                        href={b.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass(
                          "secondary",
                          "inline-flex items-center gap-2",
                        )}
                      >
                        <Download className="h-4 w-4" />
                        Attachment
                      </a>
                    ) : null}
                  </div>
                </Card>
              </FadeInUp>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
