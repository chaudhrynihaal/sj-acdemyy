"use client";

import { useState } from "react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { EnrolModal } from "@/components/home/enrol-modal";

const subjects = [
  {
    title: "English Language",
    description:
      "Master the nuances of linguistics, creative writing, and critical analysis. Our curriculum is tailored to refine communication skills and excel in competitive examinations through meticulous feedback.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGZYDzAqzS_sx66GB7yAWgGb3FvgEFsW2cJFIPU2qtMLwjMuuIam20M7ILZh41JsV6wQB1iYODIpAIPItNZ1kwJY-EkHnHPGmmI7XiKCJ_ViI2AY7UsyothAkglFjHjZhUX38Qfpcwj_iPpiRz4B4x_AW-lUPtsyZFN6B1LeWuruSanpjEMjvkTpDsO9-_79SsMezCfiUwYpoZUX3QlAz-frW1O4ykI66QzAuHksoAI1yPDMd0KNIwnx6I2Ed8rVB4y_WtsqZ0YF3c",
  },
  {
    title: "Sociology",
    description:
      "Explore the intricacies of society, culture, and human behavior. We provide deep insights into theoretical frameworks and contemporary social issues to prepare students for academic distinction.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKRyzlnOeNgHGC8y3HPAP07SFSUjGVQXj-sqvIMw4fEKCTnnRAF-ETwB4j4VzT3iR1rut_QyCYL3BoHBecX3rt6ymny9n1iSTZF34n3Bb3uQys6UhJ4quKrKiP6IS7mqRqXXeFomqBIO4YTk-z8N96XFsNLqmfdwy3vLuPYLlf2Z_FtFQS5-ycfbcPffVusTBqsTHp3lJgnYboGLfdalEOysQtrhBrQnR7q3zFAinTsBRc_c00k_f7_kqyv1h5ZfmcJsIrBLe_LBt",
  },
];

export function SubjectSection() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(subjects[0].title);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
        <FadeInUp>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Subjects we teach
            </h2>
            <p className="mt-3 text-slate-600">
              Focused programmes designed to build confidence and results.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-8 md:grid-cols-2">
          {subjects.map((s, i) => (
            <FadeInUp key={s.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-navy hover:shadow-md">
                <div className="h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-grow flex-col border-t-4 border-gold p-8">
                  <h3 className="text-xl font-bold text-navy">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {s.description}
                  </p>
                  <button
                    type="button"
                    className="mt-6 w-full rounded-lg bg-navy py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                    onClick={() => {
                      setActive(s.title);
                      setOpen(true);
                    }}
                  >
                    Enrol Now
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
