"use client";

import Link from "next/link";
import { FadeInUp } from "@/components/motion/fade-in-up";

export function HomeCta() {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <FadeInUp>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to see the difference?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Book a free demo session and experience our teaching style firsthand.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/tuitions"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-navy shadow-md transition-all hover:scale-[1.02] hover:bg-amber-400 hover:shadow-lg"
            >
              Free Demo Session
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
