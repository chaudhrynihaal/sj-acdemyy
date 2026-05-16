import { FadeInUp } from "@/components/motion/fade-in-up";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/lib/data";
import { TestimonialSubmitDialog } from "@/components/home/testimonial-submit-dialog";

const icons = ["💎", "📚", "🎯", "💡"] as const;

const reasons = [
  {
    title: "Proven pedagogy",
    body: "Lesson plans built around examiners' expectations and real classroom experience.",
  },
  {
    title: "Curated materials",
    body: "Notes, past-paper walkthroughs, and resources you can revisit anytime.",
  },
  {
    title: "Goal-driven coaching",
    body: "Targets set with you — tracked weekly so progress stays visible.",
  },
  {
    title: "Supportive environment",
    body: "Questions welcome. We explain until it clicks — no rushing ahead.",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="min-w-[280px] max-w-sm shrink-0 scale-100">
      <p className="text-sm leading-relaxed text-slate-700">&ldquo;{t.content}&rdquo;</p>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="font-semibold text-navy">{t.name}</p>
        {t.role ? (
          <p className="text-xs font-medium text-amber-600">{t.role}</p>
        ) : null}
      </div>
    </Card>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeInUp>
          <h2 className="text-center text-3xl font-extrabold text-navy sm:text-4xl">
            Why choose us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            A premium learning experience without the noise — clarity, care, and consistency.
          </p>
        </FadeInUp>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <FadeInUp key={r.title} delay={i * 0.06}>
              <Card className="h-full text-center">
                <div className="text-3xl" aria-hidden>
                  {icons[i]}
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.body}</p>
              </Card>
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
      role: "A-Level student",
      content:
        "The Sociology sessions made theories finally feel intuitive. My essays improved within weeks.",
      created_at: new Date().toISOString(),
    },
    {
      id: "sample-2",
      name: "Hassan K.",
      role: "IGCSE English",
      content:
        "Clear feedback on every piece of writing. I walked into the exam knowing exactly what to do.",
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
      <TestimonialSubmitDialog />
    </section>
  );
}
