import { NextResponse } from "next/server";
import { createAnonSupabase } from "@/lib/supabase/anon-server";
import { sendEmail } from "@/lib/email/send";
import { adminNewTestimonialEmail } from "@/lib/email/testimonial-templates";
import { ownerInboxList } from "@/lib/email/recipients";

function clamp(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // Honeypot: a hidden field real users never see. Bots fill it → silently
  // accept (return ok) but skip the insert so they get no signal.
  if (typeof b.company === "string" && b.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof b.name === "string" ? clamp(b.name.trim(), 120) : "";
  const content =
    typeof b.content === "string" ? clamp(b.content.trim(), 2000) : "";
  const role =
    typeof b.role === "string" && b.role.trim()
      ? clamp(b.role.trim(), 80)
      : null;

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please enter your name (at least 2 characters)." },
      { status: 400 },
    );
  }

  if (!content || content.length < 10) {
    return NextResponse.json(
      { error: "Please write a bit more about your experience (at least 10 characters)." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAnonSupabase();
    const { error } = await supabase.from("testimonials").insert({
      name,
      content,
      role,
      status: "pending",
    });

    if (error) {
      console.error("[testimonials POST]", error);
      return NextResponse.json(
        { error: "Could not submit right now. Please try again later." },
        { status: 500 },
      );
    }

    const ownerTos = ownerInboxList();
    if (ownerTos.length > 0) {
      const { subject: subj, text, html } = adminNewTestimonialEmail({
        name,
        content,
        role,
      });
      const to = ownerTos.length === 1 ? ownerTos[0]! : ownerTos;
      let mail = await sendEmail({
        to,
        subject: subj,
        text,
        html,
      });
      if (!mail.ok && !mail.skipped) {
        console.warn(
          "[testimonials POST] Owner email failed, retrying:",
          mail.error,
        );
        mail = await sendEmail({ to, subject: subj, text, html });
      }
      if (!mail.ok && !mail.skipped) {
        console.error("[testimonials POST] Owner notification failed:", mail.error);
      }
    } else {
      console.warn(
        "[testimonials POST] Set OWNER_EMAIL so you get new testimonial alerts.",
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[testimonials POST]", e);
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }
}
