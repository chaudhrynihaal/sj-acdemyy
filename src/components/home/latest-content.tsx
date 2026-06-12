import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { BlogListItem, ResourceFile, ResourceItem } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Badge } from "@/components/ui/badge";

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

function subjectTone(s: string): "amber" | "emerald" | "slate" {
  if (s === "English") return "amber";
  if (s === "Sociology") return "emerald";
  return "slate";
}

function downloadHref(f: ResourceFile) {
  return `${f.url}?download=${encodeURIComponent(f.name)}`;
}

export function LatestContent({
  blogs,
  resources,
}: {
  blogs: BlogListItem[];
  resources: ResourceItem[];
}) {
  if (blogs.length === 0 && resources.length === 0) return null;

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {blogs.length > 0 ? (
          <div>
            <FadeInUp>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                    From the blog
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
                    Latest insights
                  </h2>
                </div>
                <Link
                  href="/blogs"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-amber-600"
                >
                  View all blogs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeInUp>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b, i) => (
                <FadeInUp key={b.id} delay={Math.min(i * 0.06, 0.2)}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                    {b.cover_url ? (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={b.cover_url}
                          alt={b.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-2 w-full bg-gold" />
                    )}
                    <div className="flex flex-grow flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        {formatDate(b.published_at)}
                      </p>
                      <h3 className="font-display mt-3 text-lg font-bold leading-snug text-navy">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-sm text-institutional-grey">
                        By {b.author}
                      </p>
                      {b.excerpt ? (
                        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                          {b.excerpt}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <div className="mt-6">
                        <Link
                          href={`/blogs/${b.slug}`}
                          className="inline-flex rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        ) : null}

        {resources.length > 0 ? (
          <div className={blogs.length > 0 ? "mt-16 sm:mt-20" : ""}>
            <FadeInUp>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                    Free downloads
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
                    New resources
                  </h2>
                </div>
                <Link
                  href="/resources"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-amber-600"
                >
                  View all resources
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeInUp>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r, i) => (
                <FadeInUp key={r.id} delay={Math.min(i * 0.06, 0.2)}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                    <div className="h-2 w-full bg-gold" />
                    <div className="flex flex-grow flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        {formatDate(r.created_at)}
                      </p>
                      <h3 className="font-display mt-3 text-lg font-bold leading-snug text-navy">
                        {r.name}
                      </h3>
                      <div className="mt-3 flex-1">
                        <Badge tone={subjectTone(r.subject)}>{r.subject}</Badge>
                      </div>
                      <div className="mt-6">
                        {r.files.length <= 1 ? (
                          r.files[0] ? (
                            <a
                              href={downloadHref(r.files[0])}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          ) : null
                        ) : (
                          <ul className="space-y-2">
                            {r.files.map((f, idx) => (
                              <li key={idx}>
                                <a
                                  href={downloadHref(f)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy hover:bg-slate-50"
                                >
                                  <Download className="h-4 w-4 shrink-0 text-gold" />
                                  <span className="truncate">{f.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
