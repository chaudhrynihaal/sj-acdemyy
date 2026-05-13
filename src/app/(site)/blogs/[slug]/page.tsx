import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { getBlogBySlug } from "@/lib/data";
import { FadeInUp } from "@/components/motion/fade-in-up";
import { buttonClass } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeInUp>
        <Link
          href="/blogs"
          className="text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          ← Back to blogs
        </Link>
        <p className="mt-6 text-sm font-medium text-slate-500">{published}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-navy">
          {post.title}
        </h1>
        <p className="mt-2 text-slate-600">By {post.author}</p>
      </FadeInUp>

      {post.file_url ? (
        <div className="mt-8">
          <a
            href={post.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("secondary", "inline-flex items-center gap-2")}
          >
            <Download className="h-4 w-4" />
            Download attachment
          </a>
        </div>
      ) : null}

      <FadeInUp delay={0.06} className="mt-10 max-w-none">
        {post.excerpt ? (
          <p className="text-lg leading-relaxed text-slate-700">{post.excerpt}</p>
        ) : null}
        {post.body ? (
          <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
            {post.body}
          </div>
        ) : (
          <p className="mt-6 text-slate-600">
            Full article body can be added from the admin panel.
          </p>
        )}
      </FadeInUp>
    </article>
  );
}
