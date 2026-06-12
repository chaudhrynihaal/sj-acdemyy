"use client";

import { useState } from "react";
import {
  Laptop,
  Users,
  CheckCircle,
  Clock,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { DemoSessionDialog } from "@/components/tuitions/demo-session-dialog";

const waDigits =
  process.env.NEXT_PUBLIC_WHATSAPP_E164?.replace(/\D/g, "") || "923002029179";

const feeWaHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
  "Hi SJ Academy, I'd like to know about the fee structure.",
)}`;

const onlineFeatures = [
  "Recorded sessions for revision",
  "Interactive digital whiteboards",
  "Global accessibility",
];

const f2fFeatures = [
  "Premium facilities",
  "Zero-distraction learning zone",
  "In-person peer collaboration",
];

export function TuitionsContent() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-16">
          <FadeInUp>
            <p className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
              Academic Excellence
            </p>
            <h1 className="font-display mb-6 text-5xl font-bold leading-tight text-navy sm:text-6xl">
              Tuitions
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-institutional-grey">
              Flexible delivery — the same rigorous standards, whether you join
              online or in person in Faisalabad.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={feeWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-gold px-8 py-4 text-sm font-semibold text-navy shadow-md transition-all hover:brightness-105"
              >
                Discuss Fee Structure
              </a>
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-navy bg-white px-8 py-4 text-sm font-semibold text-navy shadow-sm transition-all hover:bg-muted"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Inquiry
              </a>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.12}>
            <div className="relative hidden lg:block">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA79fAI0_gZUO4YRJXF5HPMnyI2mBtyg05wOZRSoLf3rH5hs8Sc-7d7i95q03kUQoIdkX6pqKB2oDTFPzH9vP5qTgkKEl8xryneHgRQg06R0vTeylGFzDAqll_dwQiDtJXod2BTuiqgpoFuScPVSIInOatyDquBvTVIsnULvhv6b_P7AYmbGdgaWXSYIidFymhfEtZqdPbuEDckNyktg3lZcLfXkjP6p4VAi6GDBV_t-8FnjjrkVVwq5MEGn2oyo06IyUzL9a4flcs"
                  alt="Student studying in a modern academic environment"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 max-w-xs rounded-xl bg-navy p-8 shadow-xl">
                <p className="font-display mb-2 text-lg italic text-white">
                  &ldquo;Tailored for success.&rdquo;
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  Our personalized approach ensures every student reaches their
                  full potential through specialized support.
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Delivery Modes */}
      <section className="bg-background py-20 lg:pt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <FadeInUp>
            <div className="mb-14 text-center">
              <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
                Choose Your Learning Path
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 rounded bg-gold" />
            </div>
          </FadeInUp>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Online */}
            <FadeInUp delay={0.05}>
              <div className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-navy">
                    <Laptop className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy">
                    Online
                  </h3>
                </div>
                <p className="mb-8 flex-grow text-sm leading-relaxed text-slate-600">
                  Live lessons with shared notes, screen annotation, and
                  recordings where appropriate. Ideal for busy schedules and
                  learners outside Faisalabad.
                </p>
                <ul className="mb-8 space-y-3">
                  {onlineFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald" fill="currentColor" strokeWidth={0} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="w-full rounded-lg border border-navy py-4 text-sm font-semibold text-navy transition-all group-hover:bg-navy group-hover:text-white"
                >
                  Book Online Demo
                </button>
              </div>
            </FadeInUp>

            {/* Face-to-face */}
            <FadeInUp delay={0.1}>
              <div className="flex h-full flex-col rounded-xl border border-slate-200 border-t-4 border-t-gold bg-white p-10 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-navy">
                    <Users className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy">
                    Face-to-face
                  </h3>
                </div>
                <p className="mb-8 flex-grow text-sm leading-relaxed text-slate-600">
                  In-person sessions in{" "}
                  <span className="font-semibold text-navy">
                    Faisalabad only
                  </span>{" "}
                  — focused blocks with immediate feedback and a
                  distraction-free environment.
                </p>
                <ul className="mb-8 space-y-3">
                  {f2fFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald" fill="currentColor" strokeWidth={0} />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-navy py-4 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  Visit Us
                </a>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <FadeInUp>
            <div className="overflow-hidden rounded-xl bg-navy lg:flex">
              <div className="flex flex-col justify-center p-12 text-white lg:w-1/2 lg:p-16">
                <h2 className="font-display mb-4 text-3xl font-bold text-white sm:text-4xl">
                  Weekly timings
                </h2>
                <p className="mb-8 text-base leading-relaxed text-slate-300">
                  Our sessions are structured to provide maximum focus after
                  standard school and work hours.
                </p>
                <div className="flex items-center gap-6 rounded-lg border border-white/10 bg-white/10 p-6">
                  <Clock className="h-10 w-10 shrink-0 text-gold" strokeWidth={1.5} />
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">
                      Monday – Friday
                    </p>
                    <p className="text-2xl font-bold text-white">
                      From 4:00 PM <span className="text-slate-300">onwards</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Flexible evening slots by appointment
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[280px] lg:w-1/2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDROh2aKNPzRVNpvKsx5rBhtUJCwDeF0WjZvxn6bnjhPpDoqYF-Xgopy9wrE723Lji8Aj4aF-n9xtQovW8rLm_DPNJczlqzgr2d59qjCNnGOsKK0gIT0yTzqswvO-GowNM5DzejvHU9XXCJCtsW2IHsoARG-7y0uIdU3r98wU0eFiOqGk-EkwDHVOmdxUso9SihCu4kHaxbYl2xtZvGfaMLmutsCx68wITwGt-aw_X6_RLR8pzbG285jjRxbDOLL-FZP-iGAvA9WvZg"
                  alt="Academic scheduling and planning"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-navy/20 mix-blend-multiply" />
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeInUp>
            <h2 className="font-display mb-4 text-3xl font-bold text-navy sm:text-4xl">
              Ready to Elevate Your Academic Journey?
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-institutional-grey">
              Experience our methodology first-hand with a complimentary demo
              session tailored to your curriculum.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-gold px-10 py-5 text-sm font-bold text-navy shadow-lg transition-all hover:brightness-105"
              >
                Free Demo Session
              </button>
              <a
                href={feeWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-10 py-5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
              >
                <Wallet className="h-4 w-4" />
                Discuss Fee Structure
              </a>
            </div>
          </FadeInUp>
        </div>
      </section>

      <DemoSessionDialog
        key={String(demoOpen)}
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </>
  );
}

