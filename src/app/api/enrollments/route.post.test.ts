import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.hoisted(() => vi.fn());
const insertMock = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ data: null, error: null }),
);
const fromMock = vi.hoisted(() =>
  vi.fn(() => ({
    insert: insertMock,
  })),
);

vi.mock("@/lib/email/send", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/email/send")>();
  return {
    ...actual,
    sendEmail: sendEmailMock,
  };
});

vi.mock("@/lib/supabase/anon-server", () => ({
  createAnonSupabase: () => ({
    from: fromMock,
  }),
}));

describe("POST /api/enrollments — owner notification", () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
    insertMock.mockReset();
    fromMock.mockClear();
    insertMock.mockResolvedValue({ data: null, error: null });
    sendEmailMock.mockResolvedValue({ ok: true });
    process.env.OWNER_EMAIL = "owner@sjacademy.test";
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "SJ <noreply@sjacademy.test>";
  });

  it("after insert, emails OWNER_EMAIL with replyTo set to applicant email", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "Muhammad",
          email: "muhammadbinimran1000@gmail.com",
          source: "demo_session",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(fromMock).toHaveBeenCalledWith("enrollments");
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "owner@sjacademy.test",
        replyTo: "muhammadbinimran1000@gmail.com",
      }),
    );
    const call = sendEmailMock.mock.calls[0]![0] as {
      subject: string;
      text: string;
      html: string;
    };
    expect(call.subject).toContain("SJ Academy");
    expect(call.text).toContain("Muhammad");
    expect(call.text).toContain("muhammadbinimran1000@gmail.com");
    expect(call.html).toContain("<!DOCTYPE html>");
    expect(call.html).toContain("Open admin dashboard");
  });

  it("retries without replyTo when first send fails (e.g. Resend replyTo rejection)", async () => {
    sendEmailMock
      .mockResolvedValueOnce({ ok: false, error: "reply_to rejected" })
      .mockResolvedValueOnce({ ok: true });
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "Muhammad",
          email: "muhammadbinimran1000@gmail.com",
          source: "demo_session",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(sendEmailMock).toHaveBeenCalledTimes(2);
    expect(sendEmailMock.mock.calls[0]![0]).toMatchObject({
      replyTo: "muhammadbinimran1000@gmail.com",
    });
    expect(sendEmailMock.mock.calls[1]![0]).not.toHaveProperty("replyTo");
    expect(
      (sendEmailMock.mock.calls[1]![0] as { html?: string }).html,
    ).toContain("<!DOCTYPE html>");
  });

  it("does not call sendEmail when owner list is empty (misconfigured OWNER_EMAIL)", async () => {
    delete process.env.OWNER_EMAIL;
    delete process.env.OWNERMAIL;
    delete process.env.ACADEMY_OWNER_EMAIL;
    delete process.env.NOTIFICATION_EMAIL;
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "Muhammad",
          email: "muhammad@example.com",
          source: "demo_session",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
