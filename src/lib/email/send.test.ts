import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const emailsSend = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: emailsSend };
  },
}));

describe("sendEmail", () => {
  beforeEach(() => {
    emailsSend.mockReset();
    emailsSend.mockResolvedValue({ data: { id: "1" }, error: null });
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "SJ Academy <onboarding@resend.dev>";
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.EMAIL_PASS;
    delete process.env.email_pass;
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.EMAIL_PASS;
    delete process.env.email_pass;
    vi.resetModules();
  });

  it("returns skipped when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendEmail } = await import("@/lib/email/send");
    const r = await sendEmail({
      to: "a@b.com",
      subject: "Hi",
      text: "Body",
    });
    expect(r).toEqual({ ok: false, skipped: true });
    expect(emailsSend).not.toHaveBeenCalled();
  });

  it("calls Resend with from, to, subject, text, and optional replyTo", async () => {
    const { sendEmail } = await import("@/lib/email/send");
    const r = await sendEmail({
      to: "owner@example.com",
      subject: "Subj",
      text: "Hello",
      replyTo: "applicant@example.com",
    });
    expect(r.ok).toBe(true);
    expect(emailsSend).toHaveBeenCalledTimes(1);
    expect(emailsSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "SJ Academy <onboarding@resend.dev>",
        to: "owner@example.com",
        subject: "Subj",
        text: "Hello",
        replyTo: "applicant@example.com",
      }),
    );
  });

  it("strips wrapping quotes from EMAIL_FROM before sending", async () => {
    process.env.EMAIL_FROM = '"SJ Academy <onboarding@resend.dev>"';
    const { sendEmail } = await import("@/lib/email/send");
    await sendEmail({ to: "x@y.com", subject: "S", text: "T" });
    expect(emailsSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "SJ Academy <onboarding@resend.dev>",
      }),
    );
  });

  it("returns ok: false with error message when Resend returns an error", async () => {
    emailsSend.mockResolvedValue({
      data: null,
      error: { message: "Invalid recipient" },
    });
    const { sendEmail } = await import("@/lib/email/send");
    const r = await sendEmail({ to: "x@y.com", subject: "S", text: "T" });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("Invalid recipient");
  });
});
