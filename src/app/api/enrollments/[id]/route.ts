import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { applicantDecisionEmail } from "@/lib/email/enrollment-templates";

const DEMO = "demo_session";
const ENROL = "subject_enrol";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw =
    body && typeof body === "object" ? (body as { status?: string }).status : undefined;
  const status =
    raw === "rejected" ? "rejected" : raw === "approved" ? "approved" : null;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { error: "status must be approved or rejected" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: row, error: fetchErr } = await supabase
      .from("enrollments")
      .select("id,status,source,full_name,email,subject")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (row.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been processed." },
        { status: 409 },
      );
    }

    const { error: updErr } = await supabase
      .from("enrollments")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending");

    if (updErr) {
      console.error("[enrollments PATCH]", updErr);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    const kind =
      row.source === DEMO ? "demo" : row.source === ENROL ? "enrol" : "enrol";

    const applicantInquiryEmail = String(row.email ?? "").trim();
    if (
      !applicantInquiryEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantInquiryEmail)
    ) {
      console.warn(
        `[enrollments PATCH] Inquiry ${id} has no valid applicant email; decision saved but no email sent.`,
      );
      return NextResponse.json({ ok: true });
    }

    const { subject, text, html } = applicantDecisionEmail({
      status,
      kind,
      fullName: String(row.full_name ?? ""),
      subjectLine: row.subject,
      applicantEmail: applicantInquiryEmail,
    });

    const mail = await sendEmail({
      to: applicantInquiryEmail,
      subject,
      text,
      html,
    });
    if (!mail.ok && !mail.skipped) {
      console.error(
        "[enrollments PATCH] Applicant notification email failed:",
        mail.error,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[enrollments PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
