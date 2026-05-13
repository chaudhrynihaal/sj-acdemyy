import Link from "next/link";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { StatCounter } from "@/components/home/stat-counter";
import { SubjectSection } from "@/components/home/subject-section";
import {
  TestimonialsSection,
  WhyChooseUs,
} from "@/components/home/why-testimonials";
import { HomeCta } from "@/components/home/home-cta";
import {
  getApprovedTestimonials,
  getTotalStudents,
} from "@/lib/data";

export default async function HomePage() {
  const [totalStudents, testimonials] = await Promise.all([
    getTotalStudents(),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-muted to-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <FadeInUp>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              SJ Academy
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Tuition that turns potential into performance.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              English Language and Sociology — taught with structure, warmth, and
              relentless attention to exam success.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/tuitions">
                <span className="inline-flex rounded-full bg-navy px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-800 hover:shadow-xl">
                  View tuitions
                </span>
              </Link>
              <Link href="/resources">
                <span className="inline-flex rounded-lg border-2 border-amber-500 bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-amber-50">
                  Learning resources
                </span>
              </Link>
            </div>
          </FadeInUp>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCounter end={totalStudents} label="Learners supported" suffix="+" />
            <StatCounter end={2} label="Core subjects" />
            <StatCounter end={2} label="Delivery modes" />
            <StatCounter end={98} label="Parent satisfaction" suffix="%" />
          </div>
        </div>
      </section>

      <SubjectSection />
      <WhyChooseUs />
      <TestimonialsSection items={testimonials} />
      <HomeCta />
    </>
  );
}
