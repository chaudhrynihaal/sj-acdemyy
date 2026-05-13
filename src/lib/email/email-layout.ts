/** Escape text for safe HTML email bodies. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Preserve line breaks in plain text when shown inside HTML. */
export function nl2br(s: string): string {
  return escapeHtml(s).replace(/\r\n|\r|\n/g, "<br />");
}

const sans =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif';
const serif = "Georgia,'Times New Roman',Times,serif";

/** Muted gold — tagline & section labels (matches SJ Academy brand tone). */
const gold = "#9a7b56";

export type EmailShellParams = {
  preheader: string;
  innerHtml: string;
  /**
   * Optional first line in the gray footer (e.g. "Sent to … · sjacademy.com").
   * Pass only trusted, already-escaped HTML fragments plus intentional <a> tags.
   */
  footerLeadHtml?: string;
};

/**
 * SJ Academy transactional layout: serif headings, gold accents, gray footer block.
 * Table-based, inline styles only.
 */
export function emailShell({
  preheader,
  innerHtml,
  footerLeadHtml,
}: EmailShellParams): string {
  const pre = escapeHtml(preheader);
  const leadBlock = footerLeadHtml
    ? `<p style="margin:0 0 14px;font-family:${sans};font-size:12px;line-height:1.65;color:#666666;">${footerLeadHtml}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>SJ Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#ececec;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${pre}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#ececec;padding:40px 16px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e0e0e0;">
<tr>
<td style="padding:44px 48px 28px;border-bottom:1px solid #e8e8e8;">
<p style="margin:0;font-family:${serif};font-size:22px;font-weight:700;color:#000000;letter-spacing:-0.02em;">SJ Academy</p>
<p style="margin:10px 0 0;font-family:${sans};font-size:11px;font-weight:600;color:${gold};text-transform:uppercase;letter-spacing:0.18em;line-height:1.4;">English Language &amp; Sociology</p>
</td>
</tr>
<tr>
<td style="padding:40px 48px 0;font-family:${sans};font-size:15px;line-height:1.65;color:#333333;">
${innerHtml}
</td>
</tr>
<tr>
<td style="padding:0 0 0;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4;">
<tr>
<td style="padding:32px 48px 36px;font-family:${sans};font-size:12px;line-height:1.65;color:#666666;">
${leadBlock}
<p style="margin:0;font-family:${sans};font-size:12px;line-height:1.65;color:#666666;">SJ Academy · <a href="mailto:admissions@sjacademy.com" style="color:#555555;text-decoration:underline;">admissions@sjacademy.com</a></p>
<p style="margin:14px 0 0;font-family:${sans};font-size:12px;line-height:1.6;color:#888888;">This email was sent from an automated system. Please do not reply unless you are sure your mail client will reach the intended recipient.</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
<p style="margin:20px 0 0;font-family:${sans};font-size:11px;color:#999999;text-align:center;">&copy; SJ Academy</p>
</td>
</tr>
</table>
</body>
</html>`;
}

/** Underlined text CTA with arrow (reference layout). */
export function ctaTextLink(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<p style="margin:28px 0 0;font-family:${sans};font-size:14px;line-height:1.5;">
<a href="${h}" style="color:#000000;text-decoration:underline;font-weight:500;">${l} →</a>
</p>`;
}

/** Solid button (admin / dense actions); prefer ctaTextLink for applicant-style CTAs. */
export function ctaButton(href: string, label: string): string {
  return ctaTextLink(href, label);
}

export function textLink(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<a href="${h}" style="color:#555555;text-decoration:underline;font-size:12px;font-family:${sans};">${l}</a>`;
}

/** Small caps label above serif headline (e.g. COURSE ENQUIRY). */
export function sectionTitle(text: string): string {
  return `<p style="margin:0 0 10px;font-family:${sans};font-size:11px;font-weight:600;color:${gold};text-transform:uppercase;letter-spacing:0.22em;">${escapeHtml(text)}</p>`;
}

export function leadHeading(text: string): string {
  return `<h1 style="margin:0 0 22px;font-family:${serif};font-size:26px;font-weight:700;color:#000000;line-height:1.25;letter-spacing:-0.02em;">${escapeHtml(text)}</h1>`;
}

export function proseParagraph(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${sans};font-size:15px;line-height:1.65;color:#333333;">${escapeHtml(text)}</p>`;
}

/** Body paragraph with limited inline HTML (caller must only insert safe tags). */
export function proseParagraphHtml(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${sans};font-size:15px;line-height:1.65;color:#333333;">${html}</p>`;
}

export function salutation(nameEscaped: string): string {
  return `<p style="margin:0 0 18px;font-family:${sans};font-size:15px;line-height:1.65;color:#000000;">Dear ${nameEscaped},</p>`;
}

/** Bold course / key phrase line (reference: "English Language"). */
export function emphasisLine(text: string): string {
  return `<p style="margin:0 0 8px;font-family:${sans};font-size:15px;font-weight:700;color:#000000;line-height:1.5;">${escapeHtml(text)}</p>`;
}

export function detailRow(label: string, value: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;border-collapse:collapse;">
<tr>
<td style="padding:16px 0;border-bottom:1px solid #eeeeee;">
<p style="margin:0 0 6px;font-family:${sans};font-size:10px;font-weight:600;color:${gold};text-transform:uppercase;letter-spacing:0.16em;">${escapeHtml(label)}</p>
<p style="margin:0;font-family:${sans};font-size:15px;font-weight:500;color:#000000;line-height:1.5;">${value}</p>
</td>
</tr>
</table>`;
}

export function detailRowHtml(label: string, valueHtml: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;border-collapse:collapse;">
<tr>
<td style="padding:16px 0;border-bottom:1px solid #eeeeee;">
<p style="margin:0 0 6px;font-family:${sans};font-size:10px;font-weight:600;color:${gold};text-transform:uppercase;letter-spacing:0.16em;">${escapeHtml(label)}</p>
<div style="margin:0;font-family:${sans};font-size:15px;font-weight:400;color:#333333;line-height:1.65;">${valueHtml}</div>
</td>
</tr>
</table>`;
}

/** Optional pill tag for admin tables (subtle). */
export function badge(text: string, tone: "neutral" | "success" | "amber"): string {
  const t = escapeHtml(text);
  const border =
    tone === "success" ? "#d4e8dc" : tone === "amber" ? "#e8dcc8" : "#e4e4e7";
  const bg =
    tone === "success" ? "#f6faf7" : tone === "amber" ? "#faf7f2" : "#fafafa";
  const fg =
    tone === "success" ? "#1d4b2e" : tone === "amber" ? "#6b4e2e" : "#52525b";
  return `<span style="display:inline-block;margin:0 0 22px;padding:6px 11px;border:1px solid ${border};border-radius:2px;font-family:${sans};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${fg};background-color:${bg};">${t}</span>`;
}
