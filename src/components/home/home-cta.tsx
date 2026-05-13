"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeInUp } from "@/components/motion/fade-in-up";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 -translate-x-1/2 -skew-x-12 bg-muted" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
        <FadeInUp>
          <div className="max-w-3xl">
            <h2 className="font-display mb-6 text-4xl font-bold text-navy sm:text-5xl">
              Ready to see the difference?
            </h2>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-600">
              Book a free demo session and experience our teaching style
              firsthand. Discover how our structured warmth can unlock your true
              potential.
            </p>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-3 rounded-lg bg-gold px-10 py-5 text-sm font-semibold text-navy shadow-xl transition-all hover:scale-105"
            >
              Free Demo Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
