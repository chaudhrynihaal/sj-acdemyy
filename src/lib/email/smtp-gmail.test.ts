import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMailMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ messageId: "test-id" }),
);

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock,
    })),
  },
}));

describe("sendEmail via Gmail SMTP", () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    process.env.GMAIL_USER = "owner@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });

  afterEach(() => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.EMAIL_PASS;
    delete process.env.email_pass;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    vi.resetModules();
  });

  it("uses Gmail when GMAIL_APP_PASSWORD + GMAIL_USER are set (does not call Resend)", async () => {
    const { sendEmail } = await import("@/lib/email/send");
    const { default: nodemailer } = await import("nodemailer");
    const r = await sendEmail({
      to: "other@gmail.com",
      subject: "Hello",
      text: "Body",
      replyTo: "applicant@gmail.com",
    });
    expect(r.ok).toBe(true);
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        service: "gmail",
        auth: { user: "owner@gmail.com", pass: "abcdefghijklmnop" },
      }),
    );
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "SJ Academy <owner@gmail.com>",
        to: "other@gmail.com",
        subject: "Hello",
        text: "Body",
        replyTo: "applicant@gmail.com",
      }),
    );
  });

  it("accepts EMAIL_PASS as alias for app password", async () => {
    delete process.env.GMAIL_APP_PASSWORD;
    process.env.EMAIL_PASS = "mysecretapppass";
    const { sendEmail } = await import("@/lib/email/send");
    const { default: nodemailer } = await import("nodemailer");
    await sendEmail({ to: "x@y.com", subject: "S", text: "T" });
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: { user: "owner@gmail.com", pass: "mysecretapppass" },
      }),
    );
  });
});
