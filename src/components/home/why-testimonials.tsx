import { FadeInUp } from "@/components/motion/fade-in-up";
import type { Testimonial } from "@/lib/data";
import { TestimonialSubmitSection } from "@/components/home/testimonial-submit-section";
import { Sparkles, BookOpen, Target, Heart } from "lucide-react";

const reasons = [
  {
    title: "Proven pedagogy",
    body: "Structured methodologies refined over years of successful teaching and learner feedback.",
    Icon: Sparkles,
  },
  {
    title: "Curated materials",
    body: "Exclusive resources and revision guides designed to target specific exam board requirements.",
    Icon: BookOpen,
  },
  {
    title: "Goal-driven coaching",
    body: "Clear objectives for every session, ensuring continuous progress and measurable growth.",
    Icon: Target,
  },
  {
    title: "Supportive environment",
    body: "Warm, encouraging atmosphere where students feel safe to ask questions and take risks.",
    Icon: Heart,
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-navy/80 p-10">
      <div className="pointer-events-none absolute right-10 top-8 select-none font-serif text-5xl text-gold/20">
        &ldquo;
      </div>
      <p className="relative z-10 mb-8 text-base italic leading-relaxed text-slate-200">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-lg font-bold text-navy">
          {t.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-white">{t.name}</p>
          {t.role ? <p className="text-sm text-slate-400">{t.role}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
        <FadeInUp>
          <div className="mb-12">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Why choose us
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              A premium learning experience without the noise — clarity, care,
              and consistency.
            </p>
          </div>
        </FadeInUp>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <FadeInUp key={r.title} delay={i * 0.06}>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-slate-100">
                  <r.Icon className="h-5 w-5 text-navy" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-navy">{r.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{r.body}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  const fallback: Testimonial[] = [
    {
      id: "sample-1",
      name: "Amina R.",
      role: "A-Level Student",
      content:
        "Sociology felt overwhelming until I joined SJ Academy. The curated materials and goal-driven coaching made complex theories accessible. I'm now aiming for an A* in my A Levels.",
      created_at: new Date().toISOString(),
    },
    {
      id: "sample-2",
      name: "Hassan K.",
      role: "O Level Student",
      content:
        "The structured approach at SJ Academy completely changed my perspective on O Level English. The focus on exam technique alongside language mastery gave me the confidence I needed for my finals.",
      created_at: new Date().toISOString(),
    },
  ];

  const list = items.length ? items : fallback;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeInUp>
        <h2 className="text-center text-3xl font-extrabold text-navy sm:text-4xl">
          What families say
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Approved testimonials from our community.
        </p>
      </FadeInUp>
      <div className="mt-12 flex gap-6 overflow-x-auto pb-4 pt-2 [scrollbar-width:thin] sm:gap-6">
        {list.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
      <FadeInUp>
        <TestimonialSubmitSection />
      </FadeInUp>
    </section>
  );
}
