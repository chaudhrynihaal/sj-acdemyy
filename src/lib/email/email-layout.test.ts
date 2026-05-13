import { describe, expect, it } from "vitest";
import { escapeHtml, nl2br } from "@/lib/email/email-layout";

describe("escapeHtml", () => {
  it("escapes special characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});

describe("nl2br", () => {
  it("escapes and converts newlines", () => {
    expect(nl2br("a\n<b>")).toBe("a<br />&lt;b&gt;");
  });
});
