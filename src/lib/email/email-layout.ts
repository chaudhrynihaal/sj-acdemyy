/* =============================================================================
 * SJ Academy transactional email layout.
 *
 * Brand parity with the marketing site (see src/app/globals.css):
 *   - Inter sans-serif throughout, with email-safe fallbacks.
 *   - Navy #0f172a primary, amber #f59e0b / #d97706 accents.
 *   - Emerald #10b981 for positive states, slate scale for neutrals.
 *
 * Table-based, inline-styled HTML for broad client compatibility (Gmail,
 * Outlook, Apple Mail). The shell exposes an optional "hero" band so callers
 * can place the eyebrow / headline / status badge above the body content
 * without inventing their own structure.
 * ============================================================================ */

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

const FONT =
  'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif';

const C = {
  navy: "#0f172a",
  navy800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  amber500: "#f59e0b",
  amber600: "#d97706",
  amber700: "#b45309",
  amber900: "#78350f",
  amber200: "#fde68a",
  amber100: "#fef3c7",
  amber50: "#fffbeb",
  emerald: "#10b981",
  emerald700: "#047857",
  emerald200: "#a7f3d0",
  emerald50: "#ecfdf5",
  white: "#ffffff",
};

export type Tone = "approved" | "update" | "rejected" | "neutral";

type ToneStyle = { bg: string; border: string; fg: string; accent: string };

const TONE: Record<Tone, ToneStyle> = {
  approved: { bg: C.emerald50, border: C.emerald200, fg: C.emerald700, accent: C.emerald },
  update: { bg: C.amber50, border: C.amber200, fg: C.amber700, accent: C.amber500 },
  rejected: { bg: C.slate50, border: C.slate200, fg: C.slate700, accent: C.slate500 },
  neutral: { bg: C.slate50, border: C.slate200, fg: C.slate700, accent: C.amber500 },
};

/* -----------------------------------------------------------------------------
 * Shell
 * -------------------------------------------------------------------------- */

export type EmailShellParams = {
  /** Hidden inbox preview text. */
  preheader: string;
  /** Optional small-caps line above the headline in the hero band. */
  eyebrow?: string;
  /** Optional large headline shown in the hero band. */
  headline?: string;
  /** Status pill rendered in the hero band (e.g. "Approved"). */
  badgeLabel?: string;
  /** Visual tone for the hero band — colors the eyebrow / badge accent. */
  tone?: Tone;
  /** Main body HTML (use the helpers below to build it). */
  innerHtml: string;
  /**
   * Optional first line in the dark footer (e.g. "Sent to … · sjacademy.com").
   * Pass only trusted, already-escaped HTML plus intentional <a> tags.
   */
  footerLeadHtml?: string;
};

export function emailShell({
  preheader,
  eyebrow,
  headline,
  badgeLabel,
  tone = "neutral",
  innerHtml,
  footerLeadHtml,
}: EmailShellParams): string {
  const pre = escapeHtml(preheader);
  const year = new Date().getFullYear();
  const t = TONE[tone];
  const hasHero = !!(eyebrow || headline || badgeLabel);

  const heroEyebrow = eyebrow
    ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:11px;font-weight:700;color:${t.fg};text-transform:uppercase;letter-spacing:0.22em;">${escapeHtml(eyebrow)}</p>`
    : "";
  const heroHeadline = headline
    ? `<h1 style="margin:0;font-family:${FONT};font-size:24px;font-weight:800;color:${C.navy};line-height:1.3;letter-spacing:-0.02em;">${escapeHtml(headline)}</h1>`
    : "";
  const heroBadge = badgeLabel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:14px 0 0;"><tr><td style="background-color:${C.white};border:1px solid ${t.border};border-radius:9999px;padding:5px 12px;font-family:${FONT};font-size:10px;font-weight:700;color:${t.fg};text-transform:uppercase;letter-spacing:0.16em;">${escapeHtml(badgeLabel)}</td></tr></table>`
    : "";

  const hero = hasHero
    ? `<tr>
<td style="background-color:${t.bg};border-top:1px solid ${t.border};border-bottom:1px solid ${t.border};padding:26px 40px;">
${heroEyebrow}${heroHeadline}${heroBadge}
</td>
</tr>`
    : "";

  const footerLead = footerLeadHtml
    ? `<p style="margin:0 0 16px;font-family:${FONT};font-size:13px;line-height:1.65;color:${C.slate500};">${footerLeadHtml}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>SJ Academy</title>
</head>
<body style="margin:0;padding:0;background-color:${C.slate50};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${pre}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${C.slate50};">
<tr><td align="center" style="padding:32px 16px 40px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:${C.white};border:1px solid ${C.slate200};border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.04);">

<tr><td style="height:4px;background-color:${C.amber500};background-image:linear-gradient(90deg,${C.amber500} 0%,${C.amber600} 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

<tr>
<td style="padding:28px 40px 22px;border-bottom:1px solid ${C.slate100};">
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
<td style="vertical-align:middle;padding-right:12px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:${C.navy};border-radius:10px;">
<tr><td align="center" style="width:40px;height:40px;font-family:${FONT};font-size:14px;font-weight:800;color:${C.amber500};letter-spacing:0.02em;line-height:40px;">SJ</td></tr>
</table>
</td>
<td style="vertical-align:middle;">
<p style="margin:0;font-family:${FONT};font-size:17px;font-weight:800;color:${C.navy};letter-spacing:-0.01em;line-height:1.2;">SJ Academy</p>
<p style="margin:3px 0 0;font-family:${FONT};font-size:10px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.2em;line-height:1.4;">English Language &middot; Sociology</p>
</td>
</tr></table>
</td>
</tr>

${hero}

<tr>
<td style="padding:32px 40px 28px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.slate700};">
${innerHtml}
</td>
</tr>

<tr>
<td style="background-color:${C.slate50};border-top:1px solid ${C.slate200};padding:26px 40px 28px;">
${footerLead}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
<tr>
<td style="vertical-align:middle;">
<p style="margin:0;font-family:${FONT};font-size:14px;font-weight:800;color:${C.navy};letter-spacing:-0.01em;line-height:1.3;">SJ Academy</p>
<p style="margin:2px 0 0;font-family:${FONT};font-size:10px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.18em;line-height:1.4;">English Language &middot; Sociology</p>
</td>
<td align="right" style="vertical-align:middle;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.slate500};">
<a href="mailto:admissions@sjacademy.com" style="color:${C.slate700};text-decoration:none;font-weight:600;">admissions@sjacademy.com</a>
</td>
</tr>
</table>
<div style="height:1px;background-color:${C.slate200};margin:18px 0 14px;font-size:0;line-height:0;">&nbsp;</div>
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.65;color:${C.slate500};">Excellence in English Language and Sociology &mdash; online and in Faisalabad.</p>
<p style="margin:14px 0 0;font-family:${FONT};font-size:11px;line-height:1.65;color:${C.slate400};">This is an automated message from SJ Academy. For any assistance, please write to <a href="mailto:admissions@sjacademy.com" style="color:${C.slate600};text-decoration:none;font-weight:500;">admissions@sjacademy.com</a> &mdash; replies sent directly to this address may not be monitored.</p>
<p style="margin:10px 0 0;font-family:${FONT};font-size:11px;line-height:1.65;color:${C.slate400};">&copy; ${year} SJ Academy. All rights reserved.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* -----------------------------------------------------------------------------
 * Body helpers
 * -------------------------------------------------------------------------- */

export function salutation(nameEscaped: string): string {
  return `<p style="margin:0 0 18px;font-family:${FONT};font-size:16px;font-weight:600;color:${C.navy};line-height:1.5;letter-spacing:-0.01em;">Dear ${nameEscaped},</p>`;
}

export function proseParagraph(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.slate700};">${escapeHtml(text)}</p>`;
}

/** Body paragraph with limited inline HTML (caller must only insert safe tags). */
export function proseParagraphHtml(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.slate700};">${html}</p>`;
}

/** Subheading inside body content (when not using the shell's hero band). */
export function bodyHeading(text: string): string {
  return `<h2 style="margin:28px 0 14px;font-family:${FONT};font-size:18px;font-weight:700;color:${C.navy};line-height:1.3;letter-spacing:-0.01em;">${escapeHtml(text)}</h2>`;
}

/** Small-caps eyebrow used inside body content (paired with bodyHeading). */
export function bodyEyebrow(text: string): string {
  return `<p style="margin:0 0 10px;font-family:${FONT};font-size:11px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.2em;">${escapeHtml(text)}</p>`;
}

/** Course / key phrase highlight — amber rail on muted bg, labelled "Programme". */
export function emphasisLine(text: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:6px 0 22px;border-collapse:separate;">
<tr>
<td style="padding:14px 18px 16px;background-color:${C.slate50};border:1px solid ${C.slate200};border-left:3px solid ${C.amber500};border-radius:8px;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:10px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.18em;line-height:1.4;">Programme</p>
<p style="margin:0;font-family:${FONT};font-size:16px;font-weight:700;color:${C.navy};line-height:1.4;letter-spacing:-0.01em;">${escapeHtml(text)}</p>
</td>
</tr>
</table>`;
}

/* -----------------------------------------------------------------------------
 * Summary card — grouped label/value rows
 * -------------------------------------------------------------------------- */

export type SummaryItem = {
  label: string;
  /** Plain text — will be escaped. Use `valueHtml` instead for safe inline HTML. */
  value?: string;
  /** Already-safe HTML fragment (anchor tags, line breaks, …). */
  valueHtml?: string;
};

export function summaryCard(items: SummaryItem[], title?: string): string {
  const visible = items.filter((it) => it.value != null || it.valueHtml != null);
  const rows = visible
    .map((item, idx, arr) => {
      const isLast = idx === arr.length - 1;
      const sep = isLast ? "" : `border-bottom:1px solid ${C.slate100};`;
      const inner = item.valueHtml ?? escapeHtml(item.value ?? "");
      return `<tr>
<td style="padding:14px 18px;${sep}">
<p style="margin:0 0 6px;font-family:${FONT};font-size:10px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.16em;">${escapeHtml(item.label)}</p>
<div style="margin:0;font-family:${FONT};font-size:15px;font-weight:500;color:${C.navy};line-height:1.55;word-break:break-word;">${inner}</div>
</td>
</tr>`;
    })
    .join("");
  const head = title
    ? `<tr><td style="padding:14px 18px;border-bottom:1px solid ${C.slate200};background-color:${C.slate50};font-family:${FONT};font-size:11px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(title)}</td></tr>`
    : "";
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:10px 0 18px;border:1px solid ${C.slate200};border-radius:12px;border-collapse:separate;background-color:${C.white};overflow:hidden;">
${head}${rows}
</table>`;
}

/* -----------------------------------------------------------------------------
 * Next-steps block
 * -------------------------------------------------------------------------- */

export function numberedStep(n: number, title: string, text: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;border-collapse:collapse;">
<tr>
<td width="34" valign="top" style="padding-top:1px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:${C.navy};border-radius:9999px;">
<tr><td align="center" style="width:28px;height:28px;font-family:${FONT};font-size:12px;font-weight:800;color:${C.amber500};line-height:28px;">${n}</td></tr>
</table>
</td>
<td valign="top" style="padding:2px 0 0 14px;">
<p style="margin:0 0 4px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.navy};line-height:1.4;">${escapeHtml(title)}</p>
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.65;color:${C.slate600};">${escapeHtml(text)}</p>
</td>
</tr>
</table>`;
}

export function nextStepsBlock(title: string, stepsHtml: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:14px 0 18px;border:1px solid ${C.slate200};border-radius:12px;border-collapse:separate;background-color:${C.slate50};overflow:hidden;">
<tr><td style="padding:14px 18px;border-bottom:1px solid ${C.slate200};font-family:${FONT};font-size:11px;font-weight:700;color:${C.amber600};text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(title)}</td></tr>
<tr><td style="padding:18px 18px 6px;">${stepsHtml}</td></tr>
</table>`;
}

/* -----------------------------------------------------------------------------
 * Calls to action
 * -------------------------------------------------------------------------- */

/** Primary CTA — solid amber pill with white label. */
export function ctaButton(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 8px;">
<tr>
<td align="center" bgcolor="${C.amber600}" style="border-radius:9999px;background-color:${C.amber600};box-shadow:0 1px 2px rgba(217,119,6,0.25);">
<a href="${h}" style="display:inline-block;padding:14px 30px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.white};text-decoration:none;letter-spacing:0.01em;border-radius:9999px;">${l}</a>
</td>
</tr>
</table>`;
}

/** Secondary CTA — inline link with arrow indicator. */
export function ctaTextLink(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<p style="margin:18px 0 4px;font-family:${FONT};font-size:14px;line-height:1.5;">
<a href="${h}" style="color:${C.amber600};text-decoration:none;font-weight:700;letter-spacing:0.01em;">${l} &rarr;</a>
</p>`;
}

export function textLink(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<a href="${h}" style="color:${C.navy};text-decoration:none;font-weight:600;font-size:13px;font-family:${FONT};">${l}</a>`;
}

/** Inline link helper for use inside paragraphs / card values. */
export function inlineLink(href: string, label: string): string {
  const h = escapeHtml(href);
  const l = escapeHtml(label);
  return `<a href="${h}" style="color:${C.navy};text-decoration:none;font-weight:600;">${l}</a>`;
}

/* -----------------------------------------------------------------------------
 * Notes & decoration
 * -------------------------------------------------------------------------- */

/** Subtle slate-tinted note for tips, hints, alternatives. */
export function infoNote(html: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0 6px;border-collapse:collapse;">
<tr>
<td style="padding:14px 16px;background-color:${C.slate50};border:1px solid ${C.slate200};border-left:3px solid ${C.amber500};border-radius:8px;font-family:${FONT};font-size:13px;line-height:1.65;color:${C.slate600};">
${html}
</td>
</tr>
</table>`;
}

export function divider(): string {
  return `<div style="height:1px;background-color:${C.slate100};margin:24px 0;font-size:0;line-height:0;">&nbsp;</div>`;
}

/** Pill tag. Kept for compatibility with older callers; prefer the shell's badgeLabel. */
export function badge(text: string, kind: "neutral" | "success" | "amber"): string {
  const t = escapeHtml(text);
  const palette =
    kind === "success"
      ? { bg: C.emerald50, fg: C.emerald700, bd: C.emerald200 }
      : kind === "amber"
        ? { bg: C.amber50, fg: C.amber700, bd: C.amber200 }
        : { bg: C.slate50, fg: C.slate700, bd: C.slate200 };
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;"><tr>
<td style="background-color:${palette.bg};border:1px solid ${palette.bd};border-radius:9999px;padding:6px 12px;font-family:${FONT};font-size:10px;font-weight:700;color:${palette.fg};text-transform:uppercase;letter-spacing:0.16em;">${t}</td>
</tr></table>`;
}
