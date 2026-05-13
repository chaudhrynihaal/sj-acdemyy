import {
  badge,
  ctaButton,
  detailRow,
  detailRowHtml,
  emailShell,
  escapeHtml,
  leadHeading,
  nl2br,
  proseParagraph,
  sectionTitle,
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

  const lines = [
    "A new testimonial was submitted on sjacademy.com.",
    "Review in Admin → Testimonials:",
    dashUrl,
    "",
    "---",
    `Name: ${params.name}`,
    params.role ? `Label: ${params.role}` : null,
    `Quote:\n${params.content}`,
  ].filter(Boolean) as string[];

  const text = lines.join("\n");

  const inner = `
${sectionTitle("Admin notification")}
${leadHeading("New testimonial submitted")}
${proseParagraph(
  "Someone shared feedback through the website. Approve it to display on the homepage, or reject it if it should not be published.",
)}
${badge("Pending review", "amber")}
${detailRow("Name", escapeHtml(params.name))}
${params.role ? detailRow("Label", escapeHtml(params.role)) : ""}
${detailRowHtml("Quote", nl2br(params.content))}
${ctaButton(dashUrl, "Review in admin")}
`;

  const html = emailShell({
    preheader: `Testimonial from ${params.name}`,
    innerHtml: inner,
  });

  return { subject, text, html };
}
