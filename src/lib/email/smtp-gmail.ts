import nodemailer from "nodemailer";
import { normalizeEmailFromHeader, stripEnvValue } from "@/lib/email/normalize-env";
import { ownerInboxList } from "@/lib/email/recipients";

type MailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string | string[];
};

/** Google App Passwords may include spaces; SMTP auth expects them removed. */
function smtpPassword(): string {
  const raw = stripEnvValue(
    process.env.GMAIL_APP_PASSWORD ??
      process.env.SMTP_PASS ??
      process.env.EMAIL_PASS ??
      process.env.email_pass ??
      "",
  );
  return raw.replace(/\s+/g, "");
}

function smtpUser(): string | undefined {
  const explicit =
    process.env.GMAIL_USER?.trim() || process.env.SMTP_USER?.trim();
  if (explicit) return explicit;
  const owners = ownerInboxList();
  if (owners.length === 1) return owners[0];
  return undefined;
}

export function isGmailSmtpConfigured(): boolean {
  const pass = smtpPassword();
  const user = smtpUser();
  return pass.length > 0 && !!user;
}

function fromHeaderForGmail(smtpUserAddr: string): string {
  const raw = process.env.EMAIL_FROM?.trim();
  if (raw) return normalizeEmailFromHeader(raw);
  return `SJ Academy <${smtpUserAddr}>`;
}

/**
 * Sends via Gmail SMTP when app password + user are set (takes precedence over Resend).
 * User must create an App Password: Google Account → Security → 2-Step Verification → App passwords.
 */
export async function sendViaGmailSmtp({
  to,
  subject,
  text,
  html,
  replyTo,
}: MailPayload): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const pass = smtpPassword();
  const user = smtpUser();
  if (!pass || !user) {
    console.warn(
      "[email] Gmail SMTP: set GMAIL_APP_PASSWORD (or EMAIL_PASS / email_pass) and GMAIL_USER (or a single OWNER_EMAIL).",
    );
    return { ok: false, skipped: true };
  }

  const from = fromHeaderForGmail(user);
  const toStr = Array.isArray(to) ? to.join(", ") : to;
  const reply =
    replyTo === undefined
      ? undefined
      : typeof replyTo === "string"
        ? normalizeEmailFromHeader(replyTo)
        : replyTo.map((r) => normalizeEmailFromHeader(r)).join(", ");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from,
      to: toStr,
      subject,
      text,
      ...(html ? { html } : {}),
      ...(reply ? { replyTo: reply } : {}),
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[email] Gmail SMTP send failed:", e);
    return { ok: false, error: message };
  }
}
