import { describe, expect, it } from "vitest";
import {
  normalizeEmailFromHeader,
  stripEnvValue,
} from "@/lib/email/normalize-env";

describe("stripEnvValue", () => {
  it("trims whitespace", () => {
    expect(stripEnvValue("  a@b.co  ")).toBe("a@b.co");
  });

  it("removes one layer of double quotes (common .env mistake)", () => {
    expect(stripEnvValue('"owner@example.com"')).toBe("owner@example.com");
  });

  it("removes one layer of single quotes", () => {
    expect(stripEnvValue("'owner@example.com'")).toBe("owner@example.com");
  });

  it("strips nested quotes repeatedly", () => {
    expect(stripEnvValue(`"'owner@example.com'"`)).toBe("owner@example.com");
  });

  it("removes UTF-8 BOM", () => {
    expect(stripEnvValue("\uFEFFowner@example.com")).toBe("owner@example.com");
  });
});

describe("normalizeEmailFromHeader", () => {
  it("collapses newlines inside angle brackets (bad .env / editor wrap)", () => {
    expect(
      normalizeEmailFromHeader("SJ Academy <onboarding@\nresend.dev>"),
    ).toBe("SJ Academy <onboarding@resend.dev>");
  });

  it("removes stray spaces inside the email address", () => {
    expect(
      normalizeEmailFromHeader("SJ Academy <onboarding@ resend . dev >"),
    ).toBe("SJ Academy <onboarding@resend.dev>");
  });
});
