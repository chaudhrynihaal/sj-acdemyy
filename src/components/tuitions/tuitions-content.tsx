"use client";

import { useState } from "react";
import { Globe, MapPin } from "lucide-react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Card } from "@/components/ui/card";
import { Button, buttonClass } from "@/components/ui/button";
import { DemoSessionDialog } from "@/components/tuitions/demo-session-dialog";

const waDigits =
  process.env.NEXT_PUBLIC_WHATSAPP_E164?.replace(/\D/g, "") || "923000000000";

export function TuitionsActions() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
        <a
          href="mailto:admissions@sjacademy.com?subject=Fee%20structure%20inquiry"
          className={buttonClass("secondary", "w-full sm:w-auto")}
        >
          Discuss Fee Structure
        </a>
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "w-full sm:w-auto")}
        >
          WhatsApp Inquiry
        </a>
        <Button
          type="button"
          variant="secondary"
          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 sm:w-auto"
          onClick={() => setDemoOpen(true)}
        >
          Free Demo Session
        </Button>
      </div>
      <DemoSessionDialog
        key={String(demoOpen)}
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </>
  );
}

export function TuitionsContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeInUp>
        <h1 className="text-center text-4xl font-extrabold text-navy sm:text-5xl">
          Tuitions
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
          Flexible delivery — the same rigorous standards, whether you join online or
          in person in Faisalabad.
        </p>
      </FadeInUp>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <FadeInUp delay={0.05}>
          <Card className="h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Globe className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-navy">Online</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Live lessons with shared notes, screen annotation, and recordings where
              appropriate. Ideal for busy schedules and learners outside Faisalabad.
            </p>
          </Card>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <Card className="h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <MapPin className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-navy">Face-to-face</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              In-centre sessions in{" "}
              <span className="font-semibold text-navy">Faisalabad only</span> — focused
              blocks with immediate feedback and a distraction-free environment.
            </p>
          </Card>
        </FadeInUp>
      </div>

      <FadeInUp delay={0.12}>
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border-2 border-amber-500 bg-amber-50 px-6 py-5 text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
            Weekly timings
          </p>
          <p className="mt-2 text-xl font-extrabold text-navy">Mon–Fri</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">4 PM onwards</p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <TuitionsActions />
      </FadeInUp>
    </div>
  );
}
