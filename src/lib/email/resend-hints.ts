import { normalizeEmailFromHeader } from "@/lib/email/normalize-env";

/** True when EMAIL_FROM uses Resend shared test domains (delivery rules are stricter). */
export function isResendSharedTestFrom(from: string): boolean {
  const f = normalizeEmailFromHeader(from).toLowerCase();
  return (
    f.includes("@resend.dev") ||
    f.includes("@resend.test") ||
    f.includes("onboarding@resend.")
  );
}

/** Logged when owner notification fails so operators know the usual fix. */
export function resendOwnerDeliveryHint(from: string, errorMessage?: string): string {
  const err = (errorMessage ?? "").toLowerCase();
  if (isResendSharedTestFrom(from)) {
    return (
      "[enrollments POST] Resend test sender (@resend.dev): new-inquiry mail is often only delivered to the email tied to your Resend account. " +
      "To notify OWNER_EMAIL reliably, verify your domain at https://resend.com/domains and set EMAIL_FROM to an address on that domain (e.g. noreply@yourdomain.com)."
    );
  }
  if (err.includes("testing") || err.includes("only send") || err.includes("verify a domain")) {
    return (
      "[enrollments POST] Resend rejected this recipient. Verify a sending domain at https://resend.com/domains or use OWNER_EMAIL = your Resend signup email while testing."
    );
  }
  return "";
}
