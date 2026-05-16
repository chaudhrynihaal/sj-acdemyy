"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import CountUp from "react-countup";

type StatCounterProps = {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
  variant?: "light" | "dark";
};

export function StatCounter({
  end,
  label,
  suffix = "",
  prefix = "",
  variant = "light",
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (variant === "dark") {
    return (
      <div ref={ref} className="flex flex-col">
        <div className="text-3xl font-bold tracking-tight text-gold sm:text-4xl">
          {isInView ? (
            <CountUp end={end} duration={2.2} suffix={suffix} prefix={prefix} />
          ) : (
            <span>0{suffix}</span>
          )}
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-lg"
    >
      <div className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
        {isInView ? (
          <CountUp end={end} duration={2.2} suffix={suffix} prefix={prefix} />
        ) : (
          <span>0{suffix}</span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
