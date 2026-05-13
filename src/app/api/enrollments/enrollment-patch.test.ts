import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailMock = vi.hoisted(() => vi.fn());

const testId = "550e8400-e29b-41d4-a716-446655440000";
const mockRow = {
  id: testId,
  status: "pending" as const,
  source: "demo_session",
  full_name: "Muhammad",
  email: "muhammadbinimran1000@gmail.com",
  subject: null as string | null,
};

vi.mock("@/lib/email/send", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/email/send")>();
  return {
    ...actual,
    sendEmail: sendEmailMock,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "admin-user" } },
        error: null,
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: mockRow, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    })),
  })),
}));

describe("PATCH /api/enrollments/[id] — applicant decision email", () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue({ ok: true });
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "SJ <noreply@sjacademy.test>";
  });

  it("sends decision email to the inquiry email on file, not OWNER_EMAIL", async () => {
    process.env.OWNER_EMAIL = "owner@sjacademy.test";
    const { PATCH } = await import("./[id]/route");
    const res = await PATCH(
      new Request(`http://localhost/api/enrollments/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      }),
      { params: Promise.resolve({ id: testId }) },
    );
    expect(res.status).toBe(200);
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "muhammadbinimran1000@gmail.com",
      }),
    );
    const firstArg = sendEmailMock.mock.calls[0]![0] as Record<string, unknown>;
    expect(firstArg).not.toHaveProperty("replyTo");
    const payload = sendEmailMock.mock.calls[0]![0] as {
      subject: string;
      text: string;
    };
    expect(payload.subject).toContain("SJ Academy");
    expect(payload.text).toContain("Muhammad");
  });
});
