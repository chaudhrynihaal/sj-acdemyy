"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { EnrolModal } from "@/components/home/enrol-modal";

const subjects = [
  {
    title: "English Language",
    levels: ["O-Level", "IGCSE", "A-Level"],
    description:
      "Master the nuances of linguistics, creative writing, and critical analysis. Our curriculum is tailored to refine communication skills and excel in competitive examinations through meticulous feedback.",
    highlights: [
      "Exam-board specific essay technique",
      "Weekly marked assignments with detailed feedback",
      "Past-paper practice and model answers",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGZYDzAqzS_sx66GB7yAWgGb3FvgEFsW2cJFIPU2qtMLwjMuuIam20M7ILZh41JsV6wQB1iYODIpAIPItNZ1kwJY-EkHnHPGmmI7XiKCJ_ViI2AY7UsyothAkglFjHjZhUX38Qfpcwj_iPpiRz4B4x_AW-lUPtsyZFN6B1LeWuruSanpjEMjvkTpDsO9-_79SsMezCfiUwYpoZUX3QlAz-frW1O4ykI66QzAuHksoAI1yPDMd0KNIwnx6I2Ed8rVB4y_WtsqZ0YF3c",
  },
  {
    title: "Sociology",
    levels: ["O-Level", "A-Level"],
    description:
      "Explore the intricacies of society, culture, and human behavior. We provide deep insights into theoretical frameworks and contemporary social issues to prepare students for academic distinction.",
    highlights: [
      "Theory made accessible with real-world examples",
      "Structured answer frameworks for every paper",
      "Targeted revision plans before examinations",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKRyzlnOeNgHGC8y3HPAP07SFSUjGVQXj-sqvIMw4fEKCTnnRAF-ETwB4j4VzT3iR1rut_QyCYL3BoHBecX3rt6ymny9n1iSTZF34n3Bb3uQys6UhJ4quKrKiP6IS7mqRqXXeFomqBIO4YTk-z8N96XFsNLqmfdwy3vLuPYLlf2Z_FtFQS5-ycfbcPffVusTBqsTHp3lJgnYboGLfdalEOysQtrhBrQnR7q3zFAinTsBRc_c00k_f7_kqyv1h5ZfmcJsIrBLe_LBt",
  },
];

export function SubjectSection() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(subjects[0].title);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
        <FadeInUp>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Our programmes
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-navy sm:text-4xl">
              Subjects we teach
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500" />
            <p className="mt-4 text-slate-600">
              Focused programmes designed to build confidence and results.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-8 md:grid-cols-2">
          {subjects.map((s, i) => (
            <FadeInUp key={s.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy/40 hover:shadow-xl">
                {/* Image with overlay title */}
                <div className="relative h-60 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap gap-1.5">
                      {s.levels.map((l) => (
                        <span
                          key={l}
                          className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-2 text-2xl font-extrabold text-white">
                      {s.title}
                    </h3>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
                </div>

                {/* Body */}
                <div className="flex flex-grow flex-col p-8">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {s.description}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {s.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="group/btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
                    onClick={() => {
                      setActive(s.title);
                      setOpen(true);
                    }}
                  >
                    Enroll Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
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
