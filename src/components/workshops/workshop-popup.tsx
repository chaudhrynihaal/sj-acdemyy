"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Workshop = {
  id: string;
  name: string;
  date_time: string;
  details: string | null;
  course: string;
};

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function startsIn(iso: string): string | null {
  try {
    const diff = new Date(iso).getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return "Starts today";
    if (days === 1) return "Starts tomorrow";
    return `Starts in ${days} days`;
  } catch {
    return null;
  }
}

export function WorkshopPopup() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const db = createClient();
        const { data } = await db
          .from("workshops")
          .select("id,name,date_time,details,course")
          .eq("is_active", true)
          .order("date_time", { ascending: true });

        if (!data?.length) return;
        setWorkshops(data as Workshop[]);
        setOpen(true);
      } catch {
        // silently fail — popup is non-critical
      }
    }
    void load();
  }, []);

  // Auto-advance the carousel; restarts whenever the index changes
  // (manual navigation resets the timer).
  useEffect(() => {
    if (!open || workshops.length < 2) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % workshops.length);
    }, 6000);
    return () => clearInterval(t);
  }, [open, workshops.length, idx]);

  function dismiss() {
    setOpen(false);
  }

  const workshop = workshops[idx] ?? null;
  const countdown = workshop ? startsIn(workshop.date_time) : null;

  return (
    <AnimatePresence>
      {workshop && open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold accent strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-navy to-slate-900 px-6 pb-6 pt-6">
              {/* Decorative glows */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl" />

              <button
                type="button"
                aria-label="Close"
                onClick={dismiss}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 ring-1 ring-amber-400/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  {workshops.length > 1 ? "New Workshops" : "New Workshop"}
                </span>
                {countdown ? (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                    {countdown}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-2xl font-extrabold leading-snug text-white">
                {workshop.name}
              </h2>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <CalendarDays className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    When
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {formatDateTime(workshop.date_time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <BookOpen className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Course
                  </p>
                  <p className="text-sm font-semibold text-navy">{workshop.course}</p>
                </div>
              </div>
              {workshop.details ? (
                <p className="rounded-xl border-l-2 border-amber-400 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {workshop.details}
                </p>
              ) : null}
            </div>
            </motion.div>

            {/* Pager — only when more than one workshop */}
            {workshops.length > 1 ? (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
                <button
                  type="button"
                  aria-label="Previous workshop"
                  onClick={() =>
                    setIdx((idx - 1 + workshops.length) % workshops.length)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-navy hover:bg-navy hover:text-white active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {workshops.map((w, i) => (
                      <button
                        key={w.id}
                        type="button"
                        aria-label={`Workshop ${i + 1} of ${workshops.length}`}
                        onClick={() => setIdx(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === idx
                            ? "w-7 bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm shadow-amber-500/40"
                            : "w-2 bg-slate-300 hover:scale-125 hover:bg-amber-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-400">
                    {idx + 1}{" "}
                    <span className="font-medium text-slate-300">/</span>{" "}
                    {workshops.length}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Next workshop"
                  onClick={() => setIdx((idx + 1) % workshops.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-navy hover:bg-navy hover:text-white active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <Link
                href="/workshops"
                onClick={dismiss}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-sm font-bold text-navy shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.03] hover:shadow-amber-500/40"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
