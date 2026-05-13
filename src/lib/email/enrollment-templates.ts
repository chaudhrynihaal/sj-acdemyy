import {
  badge,
  ctaButton,
  ctaTextLink,
  detailRow,
  detailRowHtml,
  emailShell,
  emphasisLine,
  escapeHtml,
  leadHeading,
  nl2br,
  proseParagraph,
  proseParagraphHtml,
  salutation,
  sectionTitle,
} from "@/lib/email/email-layout";
import { siteUrl } from "@/lib/email/site-url";

export type TemplatedMail = { subject: string; text: string; html: string };

/** To OWNER_EMAIL only — new inquiry submitted (not approve/reject). */
export function adminNewEnrollmentEmail(params: {
  kind: "demo" | "enrol";
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  subject: string | null;
  rowId?: string;
}): TemplatedMail {
  const type = params.kind === "demo" ? "Demo session" : "Course application";
  const subject = `[SJ Academy] New ${type.toLowerCase()} — action required`;
  const dashUrl = `${siteUrl()}/admin/dashboard`;

  const lines = [
    "A new inquiry was submitted on sjacademy.com.",
    "Review in your admin dashboard:",
    dashUrl,
    "",
    "---",
    `${type}`,
    `Name: ${params.fullName}`,
    `Email: ${params.email}`,
    params.phone ? `Phone: ${params.phone}` : null,
    params.kind === "enrol" && params.subject ? `Course: ${params.subject}` : null,
    params.message ? `Message:\n${params.message}` : null,
    params.rowId ? `Record ID: ${params.rowId}` : null,
  ].filter(Boolean) as string[];

  const text = lines.join("\n");

  const inner = `
${sectionTitle("Admin notification")}
${leadHeading("New website inquiry")}
${proseParagraph(
  "A visitor has submitted a request through your site. You may approve or decline it from the admin dashboard when convenient.",
)}
${badge(type, params.kind === "demo" ? "amber" : "neutral")}
${detailRow("Name", escapeHtml(String(params.fullName ?? "")))}
${detailRow("Email", `<a href="mailto:${escapeHtml(params.email)}" style="color:#0f172a;text-decoration:underline;">${escapeHtml(params.email)}</a>`)}
${params.phone ? detailRow("Phone", escapeHtml(params.phone)) : ""}
${params.kind === "enrol" && params.subject ? detailRow("Course", escapeHtml(params.subject)) : ""}
${params.message ? detailRowHtml("Message", nl2br(params.message)) : ""}
${params.rowId ? detailRow("Record ID", escapeHtml(params.rowId)) : ""}
${ctaButton(dashUrl, "Open admin dashboard")}
<p style="margin:20px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:#71717a;">Where supported, <strong>Reply</strong> may reach the applicant at ${escapeHtml(params.email)}.</p>
`;

  const html = emailShell({
    preheader: `${type} — ${params.fullName}`,
    innerHtml: inner,
  });

  return { subject, text, html };
}

/** To the applicant only — the email address saved on their inquiry. */
export function applicantDecisionEmail(params: {
  status: "approved" | "rejected";
  kind: "demo" | "enrol";
  fullName: string;
  subjectLine: string | null;
  applicantEmail: string;
}): TemplatedMail {
  const plainName = String(params.fullName || "there").trim() || "there";
  const nameEsc = escapeHtml(plainName);
  const course = params.subjectLine ?? "your course";
  const footerPlain = `Sent to ${params.applicantEmail} (the address on your enquiry).`;
  const homeUrl = siteUrl();

  const isDemo = params.kind === "demo";
  const approved = params.status === "approved";

  let subject: string;
  let eyebrow: string;
  let headline: string;
  let bodyText: string;
  let bodyHtml: string;
  let closing: string;

  if (isDemo) {
    if (approved) {
      subject = "[SJ Academy] Your demo request has been approved";
      eyebrow = "Demo session";
      headline = "Your request is approved";
      bodyText =
        "Thank you for your interest. We have approved your demo session request and will contact you shortly with next steps. For questions, write to admissions@sjacademy.com.";
      bodyHtml =
        "Thank you for your interest. We have approved your demo session request and will contact you shortly with next steps. For questions, write to <strong>admissions@sjacademy.com</strong>.";
      closing = "We look forward to hearing from you.";
    } else {
      subject = "[SJ Academy] Update on your demo request";
      eyebrow = "Demo session";
      headline = "Update on your request";
      bodyText =
        "Thank you for your interest in SJ Academy. We are not able to offer a demo session on this occasion. You may contact admissions@sjacademy.com to discuss alternatives.";
      bodyHtml =
        "Thank you for your interest in SJ Academy. We are not able to offer a demo session on this occasion. You may contact <strong>admissions@sjacademy.com</strong> to discuss alternatives.";
      closing = "Thank you again for considering SJ Academy.";
    }
  } else if (approved) {
    subject = "[SJ Academy] Your course enquiry has been approved";
    eyebrow = "Course enquiry";
    headline = "Your enquiry is approved";
    bodyText = `Thank you for applying regarding ${course}. We have approved your enquiry and will be in touch soon. For questions, contact admissions@sjacademy.com.`;
    bodyHtml = `Thank you for applying regarding ${escapeHtml(course)}. We have approved your enquiry and will be in touch soon. For questions, contact <strong>admissions@sjacademy.com</strong>.`;
    closing = "We look forward to supporting your learning.";
  } else {
    subject = "[SJ Academy] Update on your course enquiry";
    eyebrow = "Course enquiry";
    headline = "Update on your enquiry";
    bodyText = `Thank you for your interest in ${course}. We are not able to proceed with this application at present. You may contact admissions@sjacademy.com for feedback or other options.`;
    bodyHtml = `Thank you for your interest in ${escapeHtml(course)}. We are not able to proceed with this application at present. You may contact <strong>admissions@sjacademy.com</strong> for feedback or other options.`;
    closing = "We appreciate you taking the time to reach out.";
  }

  const text = [
    `Dear ${plainName},`,
    "",
    bodyText,
    "",
    closing,
    "",
    "---",
    footerPlain,
  ].join("\n");

  const footerLeadHtml = `${escapeHtml(footerPlain)} · <a href="${escapeHtml(homeUrl)}" style="color:#666666;text-decoration:underline;">sjacademy.com</a>`;

  const inner = `
${sectionTitle(eyebrow)}
${leadHeading(headline)}
${salutation(nameEsc)}
${proseParagraphHtml(bodyHtml)}
${proseParagraph(closing)}
${!isDemo ? emphasisLine(course) : ""}
${ctaTextLink(`${homeUrl}/tuitions`, "View programmes")}
`;

  const html = emailShell({
    preheader: `${headline} — SJ Academy`,
    innerHtml: inner,
    footerLeadHtml,
  });

  return { subject, text, html };
}
