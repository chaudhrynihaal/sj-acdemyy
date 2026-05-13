"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { ResourceItem } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const pills = ["All", "English", "Sociology", "General"] as const;

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
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-navy">{r.name}</h2>
                  <Badge tone={subjectTone(r.subject)}>{r.subject}</Badge>
                </div>
                <div className="mt-6">
                  <a
                    href={r.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </Card>
            </FadeInUp>
          ))
        )}
      </div>
    </div>
  );
}
