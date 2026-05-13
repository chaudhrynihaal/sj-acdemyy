"use client";

import { useState } from "react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnrolModal } from "@/components/home/enrol-modal";

const subjects = [
  {
    title: "English Language",
    description:
      "Structured lessons covering comprehension, writing, grammar, and exam technique — tailored to your syllabus and goals.",
  },
  {
    title: "Sociology",
    description:
      "Clear explanations of theories, themes, and essay skills with exam-focused practice and personalised feedback.",
  },
];

export function SubjectSection() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(subjects[0].title);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeInUp>
        <h2 className="text-center text-3xl font-extrabold text-navy sm:text-4xl">
          Subjects we teach
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Focused programmes designed to build confidence and results.
        </p>
      </FadeInUp>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {subjects.map((s, i) => (
          <FadeInUp key={s.title} delay={i * 0.08}>
            <Card className="flex h-full flex-col">
              <h3 className="text-xl font-bold text-navy">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {s.description}
              </p>
              <Button
                type="button"
                className="mt-6 w-full sm:w-auto"
                onClick={() => {
                  setActive(s.title);
                  setOpen(true);
                }}
              >
                Enrol Now
              </Button>
            </Card>
          </FadeInUp>
        ))}
      </div>
      <EnrolModal
        key={`${open}-${active}`}
        open={open}
        onClose={() => setOpen(false)}
        subject={active}
      />
    </section>
  );
}
