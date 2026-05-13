import {
  ctaButton,
  emailShell,
  infoNote,
  nl2br,
  proseParagraph,
  summaryCard,
  type SummaryItem,
} from "@/lib/email/email-layout";
import { siteUrl } from "@/lib/email/site-url";
import type { TemplatedMail } from "@/lib/email/enrollment-templates";

/** To OWNER_EMAIL — new testimonial submitted for moderation. */
export function adminNewTestimonialEmail(params: {
  name: string;
  content: string;
  role: string | null;
}): TemplatedMail {
  const subject = "[SJ Academy] New testimonial — review in admin";
  const dashUrl = `${siteUrl()}/admin/dashboard`;

  const items: SummaryItem[] = [
    { label: "Name", value: params.name },
  ];
  if (params.role) items.push({ label: "Label / Role", value: params.role });
  items.push({ label: "Quote", valueHtml: nl2br(params.content) });

  const inner = `
${proseParagraph(
  "A visitor shared feedback through the website. Approve it to display on the homepage, or reject it if it shouldn't be published.",
)}
${summaryCard(items, "Submission details")}
${ctaButton(dashUrl, "Review in admin")}
${infoNote(
  `Approved testimonials appear on the SJ Academy homepage. Rejected submissions are kept on file but not published.`,
)}
`;

  const text = [
    "New testimonial — SJ Academy",
    "",
    "A new testimonial has been submitted on sjacademy.com.",
    "Review it in Admin → Testimonials:",
    dashUrl,
    "",
    "---",
    `Name: ${params.name}`,
    params.role ? `Label: ${params.role}` : null,
    `Quote:\n${params.content}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = emailShell({
    preheader: `Testimonial from ${params.name}`,
    eyebrow: "Admin notification",
    headline: "A new testimonial needs your review",
    badgeLabel: "Pending review",
    tone: "update",
    innerHtml: inner,
  });

  return { subject, text, html };
}
