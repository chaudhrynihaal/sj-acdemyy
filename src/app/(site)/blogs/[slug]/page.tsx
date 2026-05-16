import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { getBlogBySlug } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      {/* Hero bar */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>
        </div>
      </div>

      <article className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-16">
          <FadeInUp>
            {published && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
                {published}
              </p>
            )}
            <h1 className="font-display text-4xl font-bold leading-tight text-navy sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-3 text-base text-institutional-grey">
              By {post.author}
            </p>

            <div className="my-8 h-px bg-slate-200" />

            {post.file_url ? (
              <a
                href={post.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-10 inline-flex items-center gap-2 rounded-lg border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-navy hover:text-white"
              >
                <Download className="h-4 w-4" />
                Download attachment
              </a>
            ) : null}
          </FadeInUp>

          <FadeInUp delay={0.06}>
            {post.excerpt ? (
              <p className="text-lg leading-relaxed text-slate-700">
                {post.excerpt}
              </p>
            ) : null}
            {post.body ? (
              <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                {post.body}
              </div>
            ) : (
              <p className="mt-6 text-slate-500">
                Full article body can be added from the admin panel.
              </p>
            )}
          </FadeInUp>
        </div>
      </article>
    </>
  );
}
