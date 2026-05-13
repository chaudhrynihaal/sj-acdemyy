import {
  ctaButton,
  ctaTextLink,
  emailShell,
  emphasisLine,
  escapeHtml,
  infoNote,
  inlineLink,
  nl2br,
  proseParagraph,
  proseParagraphHtml,
  salutation,
  summaryCard,
  type SummaryItem,
} from "@/lib/email/email-layout";
import { siteUrl } from "@/lib/email/site-url";

export type TemplatedMail = { subject: string; text: string; html: string };

const telCompact = (phone: string): string => phone.replace(/[^+\d]/g, "");

/* -----------------------------------------------------------------------------
 * Admin notification — new inquiry submitted
 * -------------------------------------------------------------------------- */

export function adminNewEnrollmentEmail(params: {
  kind: "demo" | "enrol";
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  subject: string | null;
  rowId?: string;
}): TemplatedMail {
  const isDemo = params.kind === "demo";
  const type = isDemo ? "Demo session" : "Course application";
  const subject = `[SJ Academy] New ${type.toLowerCase()} — action required`;
  const dashUrl = `${siteUrl()}/admin/dashboard`;

  const items: SummaryItem[] = [
    { label: "Inquiry type", value: type },
    { label: "Applicant", value: String(params.fullName ?? "") },
    {
      label: "Email",
      valueHtml: inlineLink(`mailto:${params.email}`, params.email),
    },
  ];
  if (params.phone) {
    items.push({
      label: "Phone",
      valueHtml: inlineLink(`tel:${telCompact(params.phone)}`, params.phone),
    });
  }
  if (!isDemo && params.subject) {
    items.push({ label: "Course of interest", value: params.subject });
  }
  if (params.message) {
    items.push({ label: "Message", valueHtml: nl2br(params.message) });
  }
  if (params.rowId) {
    items.push({ label: "Record ID", value: params.rowId });
  }

  const inner = `
${proseParagraph(
  `A new ${type.toLowerCase()} has been submitted through the SJ Academy website. The details are below — approve or decline from the admin dashboard when you're ready.`,
)}
${summaryCard(items, "Inquiry details")}
${ctaButton(dashUrl, "Open admin dashboard")}
${infoNote(
  `<strong style="color:#0f172a;">Tip:</strong> in most mail clients, pressing <strong style="color:#0f172a;">Reply</strong> to this message will reach the applicant directly at <a href="mailto:${escapeHtml(params.email)}" style="color:#0f172a;text-decoration:none;font-weight:600;">${escapeHtml(params.email)}</a>.`,
)}
`;

  const text = [
    `New ${type.toLowerCase()} — SJ Academy`,
    "",
    `A new ${type.toLowerCase()} has been submitted on sjacademy.com.`,
    `Review and act on it in your admin dashboard:`,
    dashUrl,
    "",
    "---",
    `Inquiry type: ${type}`,
    `Applicant: ${params.fullName}`,
    `Email: ${params.email}`,
    params.phone ? `Phone: ${params.phone}` : null,
    !isDemo && params.subject ? `Course: ${params.subject}` : null,
    params.message ? `Message:\n${params.message}` : null,
    params.rowId ? `Record ID: ${params.rowId}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = emailShell({
    preheader: `${type} — ${params.fullName}`,
    eyebrow: "Admin notification",
    headline: "A new inquiry needs your review",
    badgeLabel: isDemo ? "Demo request" : "Course application",
    tone: "update",
    innerHtml: inner,
  });

  return { subject, text, html };
}

/* -----------------------------------------------------------------------------
 * Applicant decision — approved / rejected
 * -------------------------------------------------------------------------- */

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
  const homeUrl = siteUrl();
  const tuitionsUrl = `${homeUrl}/tuitions`;

  const isDemo = params.kind === "demo";
  const approved = params.status === "approved";

  // -- Copy ----------------------------------------------------------------
  let subject: string;
  let eyebrow: string;
  let headline: string;
  let bodyHtml: string;
  let bodyText: string;
  let closing: string;

  if (isDemo && approved) {
    subject = "[SJ Academy] Your demo session is confirmed";
    eyebrow = "Demo session";
    headline = "Your demo is confirmed";
    bodyText =
      "Thank you for your interest in SJ Academy. We've approved your demo session request — a member of our admissions team will reach out shortly to arrange a time that works for you.";
    bodyHtml = bodyText;
    closing = "We look forward to meeting you.";
  } else if (isDemo && !approved) {
    subject = "[SJ Academy] Update on your demo session request";
    eyebrow = "Demo session";
    headline = "Update on your demo request";
    bodyText =
      "Thank you for your interest in SJ Academy. After review, we're unable to offer a demo session on this occasion. If you'd like to explore alternatives or a future intake, our admissions team is happy to help.";
    bodyHtml = bodyText;
    closing = "Thank you again for considering SJ Academy.";
  } else if (!isDemo && approved) {
    subject = "[SJ Academy] Your course enquiry has been approved";
    eyebrow = "Course enrolment";
    headline = "You're in — welcome to SJ Academy";
    bodyText = `Thank you for your interest in ${course} at SJ Academy. Your enquiry has been approved, and a member of our admissions team will be in touch shortly with the next steps.`;
    bodyHtml = `Thank you for your interest in <strong style="color:#0f172a;">${escapeHtml(course)}</strong> at SJ Academy. Your enquiry has been approved, and a member of our admissions team will be in touch shortly with the next steps.`;
    closing = "We look forward to supporting your learning journey.";
  } else {
    subject = "[SJ Academy] Update on your course enquiry";
    eyebrow = "Course enrolment";
    headline = "Update on your course enquiry";
    bodyText = `Thank you for your interest in ${course} at SJ Academy. After careful review, we're unable to proceed with this enquiry at present. If you'd like feedback or to explore another intake or programme, our admissions team is here to help.`;
    bodyHtml = `Thank you for your interest in <strong style="color:#0f172a;">${escapeHtml(course)}</strong> at SJ Academy. After careful review, we're unable to proceed with this enquiry at present. If you'd like feedback or to explore another intake or programme, our admissions team is here to help.`;
    closing = "We appreciate you taking the time to reach out.";
  }

  // -- Inner body ----------------------------------------------------------
  const approvedTail = `
${!isDemo ? emphasisLine(course) : ""}
${proseParagraph(closing)}
${ctaButton(tuitionsUrl, isDemo ? "Explore our programmes" : "View course details")}
${infoNote(
  `Have a question before we reach out? Write to <a href="mailto:admissions@sjacademy.com" style="color:#0f172a;text-decoration:none;font-weight:600;">admissions@sjacademy.com</a> and we'll get back to you within one working day.`,
)}
`;

  const rejectedTail = `
${proseParagraph(closing)}
${infoNote(
  `Interested in alternatives? Write to <a href="mailto:admissions@sjacademy.com" style="color:#0f172a;text-decoration:none;font-weight:600;">admissions@sjacademy.com</a> — we'd be glad to suggest other intakes or programmes that may suit you.`,
)}
${ctaTextLink(tuitionsUrl, "Browse all programmes")}
`;

  const inner = `
${salutation(nameEsc)}
${proseParagraphHtml(bodyHtml)}
${approved ? approvedTail : rejectedTail}
`;

  // -- Plain text ----------------------------------------------------------
  const text = [
    `Dear ${plainName},`,
    "",
    bodyText,
    "",
    closing,
    "",
    "For any questions, please write to admissions@sjacademy.com.",
    "",
    "---",
    `Sent to ${params.applicantEmail} (the address on your enquiry).`,
    "SJ Academy · sjacademy.com",
  ].join("\n");

  const footerLeadHtml = `Sent to <span style="color:#0f172a;font-weight:600;">${escapeHtml(params.applicantEmail)}</span> &mdash; the address on your enquiry.`;

  const html = emailShell({
    preheader: `${headline} — SJ Academy`,
    eyebrow,
    headline,
    badgeLabel: approved ? "Approved" : "Update",
    tone: approved ? "approved" : "rejected",
    innerHtml: inner,
    footerLeadHtml,
  });

  return { subject, text, html };
}
