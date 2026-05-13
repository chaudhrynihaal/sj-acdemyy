import { Resend } from "resend";
import { normalizeEmailFromHeader } from "@/lib/email/normalize-env";
import { isGmailSmtpConfigured, sendViaGmailSmtp } from "@/lib/email/smtp-gmail";

export { siteUrl } from "@/lib/email/site-url";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  /** HTML alternative; clients that support it show this. Always keep `text` in sync for accessibility. */
  html?: string;
  replyTo?: string | string[];
};

/**
 * Sends email: Gmail SMTP when app password is configured (takes precedence), else Resend.
 * Returns skipped: true when misconfigured (callers should still succeed on DB writes).
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
}: SendEmailInput): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  if (isGmailSmtpConfigured()) {
    return sendViaGmailSmtp({ to, subject, text, html, replyTo });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM
    ? normalizeEmailFromHeader(process.env.EMAIL_FROM)
    : "";
  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_FROM missing — email not sent (Gmail SMTP not configured).",
    );
    return { ok: false, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
      ...(replyTo
        ? {
            replyTo:
              typeof replyTo === "string"
                ? normalizeEmailFromHeader(replyTo)
                : replyTo.map((r) => normalizeEmailFromHeader(r)),
          }
        : {}),
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[email] send failed:", e);
    return { ok: false, error: message };
  }
}
