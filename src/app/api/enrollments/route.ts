import { NextResponse } from "next/server";
import { createAnonSupabase } from "@/lib/supabase/anon-server";
import { sendEmail } from "@/lib/email/send";
import { adminNewEnrollmentEmail } from "@/lib/email/enrollment-templates";
import { ownerInboxList } from "@/lib/email/recipients";
import { isResendSharedTestFrom, resendOwnerDeliveryHint } from "@/lib/email/resend-hints";

const DEMO = "demo_session";
const ENROL = "subject_enrol";
const WORKSHOP = "workshop_enrol";

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
  const full_name = typeof b.full_name === "string" ? clamp(b.full_name.trim(), 200) : "";
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 320) : "";
  const phone =
    typeof b.phone === "string" && b.phone.trim()
      ? clamp(b.phone.trim(), 40)
      : null;
  const message =
    typeof b.message === "string" && b.message.trim()
      ? clamp(b.message.trim(), 5000)
      : null;
  const source =
    b.source === ENROL
      ? ENROL
      : b.source === DEMO
        ? DEMO
        : b.source === WORKSHOP
          ? WORKSHOP
          : "";
  const subject =
    typeof b.subject === "string" && b.subject.trim()
      ? clamp(b.subject.trim(), 200)
      : null;

  if (!full_name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Name and a valid email are required." },
      { status: 400 },
    );
  }

  if (source !== DEMO && source !== ENROL && source !== WORKSHOP) {
    return NextResponse.json({ error: "Invalid request type." }, { status: 400 });
  }

  if ((source === ENROL || source === WORKSHOP) && !subject) {
    return NextResponse.json(
      { error: "Subject is required for course enquiries." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAnonSupabase();
    const { error } = await supabase.from("enrollments").insert({
      full_name,
      email,
      phone,
      message,
      source,
      subject,
      status: "pending",
    });

    if (error) {
      console.error("[enrollments POST]", error);
      return NextResponse.json(
        { error: "Could not save your request. Please try again later." },
        { status: 500 },
      );
    }

    const ownerTos = ownerInboxList();
    let lastOwnerMail: Awaited<ReturnType<typeof sendEmail>> | undefined;

    if (ownerTos.length > 0) {
      const kind = source === DEMO ? "demo" : "enrol"; // workshop maps to enrol kind
      const { subject: subj, text, html } = adminNewEnrollmentEmail({
        kind,
        fullName: full_name,
        email,
        phone,
        message,
        subject,
      });
      const to = ownerTos.length === 1 ? ownerTos[0]! : ownerTos;
      let mail = await sendEmail({
        to,
        subject: subj,
        text,
        html,
        replyTo: email,
      });
      if (!mail.ok && !mail.skipped) {
        console.warn(
          "[enrollments POST] Owner email with replyTo failed, retrying without replyTo:",
          mail.error,
        );
        mail = await sendEmail({ to, subject: subj, text, html });
      }
      if (!mail.ok && !mail.skipped) {
        console.error(
          "[enrollments POST] Owner notification email failed:",
          mail.error,
        );
        const hint = resendOwnerDeliveryHint(
          process.env.EMAIL_FROM ?? "",
          mail.error,
        );
        if (hint) console.error(hint);
      }
      lastOwnerMail = mail;
    } else {
      console.warn(
        "[enrollments POST] Set OWNER_EMAIL in .env.local so the owner gets new applications.",
      );
    }

    if (process.env.NODE_ENV === "development") {
      const from = process.env.EMAIL_FROM ?? "";
      let hint: string | undefined;
      if (ownerTos.length === 0) {
        hint = "OWNER_EMAIL missing or invalid — owner list is empty.";
      } else if (lastOwnerMail?.skipped) {
        hint =
          "RESEND_API_KEY or EMAIL_FROM missing — owner notification was skipped.";
      } else if (lastOwnerMail && !lastOwnerMail.ok && !lastOwnerMail.skipped) {
        const rh = resendOwnerDeliveryHint(from, lastOwnerMail.error);
        hint = rh || lastOwnerMail.error;
      }
      return NextResponse.json({
        ok: true,
        _dev: {
          ownerListConfigured: ownerTos.length > 0,
          ownerNotifyOk: lastOwnerMail?.ok === true,
          ownerNotifySkipped: lastOwnerMail?.skipped === true,
          ownerNotifyError:
            lastOwnerMail && !lastOwnerMail.ok && !lastOwnerMail.skipped
              ? lastOwnerMail.error
              : undefined,
          usesResendTestFrom: isResendSharedTestFrom(from),
          hint,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[enrollments POST]", e);
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }
}
