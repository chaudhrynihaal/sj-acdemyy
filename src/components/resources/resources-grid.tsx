"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { ResourceItem } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const pills = ["All", "English", "Sociology", "General"] as const;

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

export function ResourcesGrid({ resources }: { resources: ResourceItem[] }) {
  const [filter, setFilter] = useState<(typeof pills)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return resources;
    return resources.filter((r) => r.subject === filter);
  }, [resources, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeInUp>
        <h1 className="text-center text-4xl font-extrabold text-navy sm:text-5xl">
          Resources
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
          Handouts, schemes, and revision packs — organised by subject.
        </p>
      </FadeInUp>

      <FadeInUp delay={0.06} className="mt-10 flex flex-wrap justify-center gap-2">
        {pills.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilter(p)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all",
              filter === p
                ? "bg-navy text-white shadow-md"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-amber-400",
            )}
          >
            {p}
          </button>
        ))}
      </FadeInUp>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-slate-600">
            No resources in this category yet.
          </p>
        ) : (
          filtered.map((r, i) => (
            <FadeInUp key={r.id} delay={Math.min(i * 0.04, 0.2)}>
              <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                <div className="h-2 w-full bg-gold" />
                <div className="flex flex-grow flex-col p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    {formatDate(r.created_at)}
                  </p>
                  <h2 className="font-display mt-3 text-xl font-bold leading-snug text-navy">
                    {r.name}
                  </h2>
                  <div className="mt-3 flex-1">
                    <Badge tone={subjectTone(r.subject)}>{r.subject}</Badge>
                  </div>
                  <div className="mt-8">
                    <a
                      href={`${r.file_url}?download=${encodeURIComponent(r.name)}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </FadeInUp>
          ))
        )}
      </div>
    </div>
  );
}
