"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, BookOpen, X } from "lucide-react";
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

export function WorkshopPopup() {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

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
        setWorkshop(data[0] as Workshop);
      } catch {
        // silently fail — popup is non-critical
      }
    }
    void load();
  }, []);

  if (!workshop) return null;

  function dismiss() {
    setWorkshop(null);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative rounded-t-2xl bg-navy px-6 pb-5 pt-6">
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            New Workshop
          </p>
          <h2 className="mt-1 text-xl font-extrabold leading-snug text-white">
            {workshop.name}
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-3 px-6 py-5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span>{formatDateTime(workshop.date_time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <BookOpen className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span>{workshop.course}</span>
          </div>
          {workshop.details ? (
            <p className="text-sm text-slate-700">{workshop.details}</p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <Link
            href="/workshops"
            onClick={dismiss}
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-navy shadow-md transition-all hover:scale-[1.02] hover:bg-amber-400"
          >
            Enrol Now
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
