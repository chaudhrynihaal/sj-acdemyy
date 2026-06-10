import Image from "next/image";
import Link from "next/link";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { StatCounter } from "@/components/home/stat-counter";
import { SubjectSection } from "@/components/home/subject-section";
import {
  TestimonialsSection,
  WhyChooseUs,
} from "@/components/home/why-testimonials";
import { HomeCta } from "@/components/home/home-cta";
import { LatestContent } from "@/components/home/latest-content";
import {
  getApprovedTestimonials,
  getBlogs,
  getResources,
  getTotalStudents,
} from "@/lib/data";

export default async function HomePage() {
  const [totalStudents, testimonials, blogs, resources] = await Promise.all([
    getTotalStudents(),
    getApprovedTestimonials(),
    getBlogs(),
    getResources(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-muted to-white">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
            {/* Left: text */}
            <div className="w-full flex-1 text-center lg:text-left">
              <FadeInUp>
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                  SJ Academy
                </p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
                  Shanzay Jawad
                </h1>
                <p className="mt-2 text-lg font-semibold text-amber-600">
                  Educationist | English &amp; Sociology Specialist
                </p>
                <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 lg:mx-0 lg:text-lg">
                  Over 23 years of experience specializing in O-Level / A-Level /
                  IGCSE English and Sociology — taught with structure, warmth, and
                  relentless attention to exam success.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link href="/tuitions">
                    <span className="inline-flex rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-800 hover:shadow-xl">
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
            </div>

            {/* Right: photo — circular with golden glow */}
            <FadeInUp delay={0.12}>
              <div
                className="relative mx-auto h-[280px] w-[280px] shrink-0 overflow-hidden rounded-full sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px]"
                style={{
                  boxShadow:
                    "0 0 0 5px rgba(245,158,11,0.55), 0 0 40px 8px rgba(245,158,11,0.28)",
                }}
              >
                <Image
                  src="/hero-photo.jpg"
                  alt="Shanzay Jawad — Educationist"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </FadeInUp>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCounter end={2000} label="Learners supported" suffix="+" />
            <StatCounter end={2} label="Core subjects" />
            <StatCounter end={2} label="Delivery modes" />
            <StatCounter end={98} label="Parent satisfaction" suffix="%" />
          </div>
        </div>
      </section>

      <SubjectSection />
      <LatestContent blogs={blogs.slice(0, 3)} resources={resources.slice(0, 3)} />
      <WhyChooseUs />
      <TestimonialsSection items={testimonials} />
      <HomeCta />
    </>
  );
}
