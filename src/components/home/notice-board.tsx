import { Megaphone } from "lucide-react";
import { FadeInUp } from "@/components/motion/fade-in-up";
import type { Notice } from "@/lib/data";

function formatNoticeDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function NoticeBoard({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;

  return (
    <section className="border-y border-amber-100 bg-amber-50/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FadeInUp>
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
              <Megaphone className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-700">
                Notice Board
              </h2>
              <p className="text-xs text-slate-500">
                Latest announcements from SJ Academy
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((n) => (
              <li
                key={n.id}
                className="rounded-xl border border-amber-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="font-semibold text-navy">{n.title}</p>
                {n.body ? (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {n.body}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {formatNoticeDate(n.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </FadeInUp>
      </div>
    </section>
  );
}
