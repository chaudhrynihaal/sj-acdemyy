"use client";

import { useState } from "react";
import { CalendarDays, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkshopEnrolModal } from "@/components/workshops/workshop-enrol-modal";
import type { Workshop } from "@/lib/data";

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type Props = { workshops: Workshop[] };

export function WorkshopsList({ workshops }: Props) {
  const [modalWorkshop, setModalWorkshop] = useState<Workshop | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Workshops</h1>
          <p className="mt-4 text-lg text-slate-300">
            Live sessions and intensive workshops on English and Sociology &mdash; join
            and level up.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {workshops.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-navy">
                No upcoming workshops at the moment.
              </p>
              <p className="mt-2 text-sm text-slate-500">Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((w) => (
                <div
                  key={w.id}
                  className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between gap-3 px-6 pt-6">
                    <h2 className="text-lg font-bold leading-snug text-navy">
                      {w.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {w.course}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="mt-4 space-y-2 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                      <span>{formatDateTime(w.date_time)}</span>
                    </div>
                    {w.details ? (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                        <span>{w.details}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Description */}
                  {w.description ? (
                    <p className="mt-3 px-6 text-sm leading-relaxed text-slate-600">
                      {w.description}
                    </p>
                  ) : null}

                  {/* Footer */}
                  <div className="mt-auto px-6 pb-6 pt-5">
                    <Button
                      type="button"
                      onClick={() => setModalWorkshop(w)}
                      className="w-full"
                    >
                      Enrol Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enrol modal */}
      {modalWorkshop ? (
        <WorkshopEnrolModal
          open
          onClose={() => setModalWorkshop(null)}
          workshopName={modalWorkshop.name}
          workshopId={modalWorkshop.id}
        />
      ) : null}
    </>
  );
}
