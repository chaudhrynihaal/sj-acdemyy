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
      {/* Hero */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full py-20">
          <FadeInUp>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">
              Premium Academic Support
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy leading-tight mb-6">
              Tuition that turns potential into performance.
            </h1>
            <p className="text-lg text-institutional-grey mb-10 max-w-lg leading-relaxed">
              English Language and Sociology — taught with structure, warmth,
              and relentless attention to exam success.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tuitions">
                <span className="inline-flex rounded bg-navy px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg">
                  View tuitions
                </span>
              </Link>
              <Link href="/resources">
                <span className="inline-flex rounded border border-navy text-navy px-8 py-4 text-sm font-semibold transition-all hover:bg-navy hover:text-white">
                  Learning resources
                </span>
              </Link>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.12}>
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-yDnQdgRuHlGxDfuRuOlLz8M3dhx_Zb4gzQmeZed3zdVNfNJFh_6Tj4MvlKDzB-SHlFdEgM4Trd1gbjXGAPjuEy9OAevg-TAXAsEkmg3_E5XR0JZzsYKXQCCg9QRNY6JueTrnomNmlRwvpYGWIKD19UiG1EfmaOJca3hzBqQiISFRrrk-9Y0yfTSa_y9ZWin1QSsTQBTJKsPJI7ssZ-oIqlFPYEha8CIHEtbeCe6VWd8SbqodM2YUucU_BozG5mpjpAKeoR29lTIM"
                alt="Focused student in a premium library"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCounter
              end={totalStudents}
              label="Learners supported"
              suffix="+"
              variant="dark"
            />
            <StatCounter end={2} label="Core subjects" variant="dark" />
            <StatCounter end={2} label="Delivery modes" variant="dark" />
            <StatCounter
              end={98}
              label="Parent satisfaction"
              suffix="%"
              variant="dark"
            />
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
