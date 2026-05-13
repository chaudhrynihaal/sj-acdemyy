import { describe, expect, it } from "vitest";
import {
  isResendSharedTestFrom,
  resendOwnerDeliveryHint,
} from "@/lib/email/resend-hints";

describe("isResendSharedTestFrom", () => {
  it("detects onboarding@resend.dev", () => {
    expect(isResendSharedTestFrom("SJ <onboarding@resend.dev>")).toBe(true);
  });

  it("returns false for a verified-domain style address", () => {
    expect(isResendSharedTestFrom("SJ <noreply@sjacademy.com>")).toBe(false);
  });
});

describe("resendOwnerDeliveryHint", () => {
  it("returns guidance when using resend.dev sender", () => {
    const h = resendOwnerDeliveryHint("SJ <onboarding@resend.dev>");
    expect(h).toContain("resend.com/domains");
  });
});
