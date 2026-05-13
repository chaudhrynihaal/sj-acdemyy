import { stripEnvValue } from "@/lib/email/normalize-env";

function emailsFromRaw(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]+/)
    .map((s) => stripEnvValue(s))
    .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
}

/** Inboxes that receive "someone applied" alerts only (never used as approve/reject recipients). */
export function ownerInboxList(): string[] {
  const candidates = [
    process.env.OWNER_EMAIL,
    process.env.OWNERMAIL,
    process.env.ACADEMY_OWNER_EMAIL,
    process.env.NOTIFICATION_EMAIL,
  ];
  for (const c of candidates) {
    const parsed = emailsFromRaw(stripEnvValue(c ?? ""));
    if (parsed.length > 0) return parsed;
  }
  return [];
}
