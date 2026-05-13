import { afterEach, describe, expect, it } from "vitest";
import { ownerInboxList } from "@/lib/email/recipients";

function clearOwnerEnvs() {
  delete process.env.OWNER_EMAIL;
  delete process.env.OWNERMAIL;
  delete process.env.ACADEMY_OWNER_EMAIL;
  delete process.env.NOTIFICATION_EMAIL;
}

describe("ownerInboxList", () => {
  afterEach(() => {
    clearOwnerEnvs();
  });

  it("parses OWNER_EMAIL without quotes", () => {
    process.env.OWNER_EMAIL = "nihaalasif5@gmail.com";
    expect(ownerInboxList()).toEqual(["nihaalasif5@gmail.com"]);
  });

  it("parses quoted OWNER_EMAIL so owner notifications are not silently dropped", () => {
    process.env.OWNER_EMAIL = '"nihaalasif5@gmail.com"';
    expect(ownerInboxList()).toEqual(["nihaalasif5@gmail.com"]);
  });

  it("supports multiple inboxes separated by comma", () => {
    process.env.OWNER_EMAIL = "a@x.com, b@y.com";
    expect(ownerInboxList()).toEqual(["a@x.com", "b@y.com"]);
  });

  it("falls back to NOTIFICATION_EMAIL when OWNER_EMAIL parses to no valid emails", () => {
    process.env.OWNER_EMAIL = '"not-an-email"';
    process.env.NOTIFICATION_EMAIL = "fallback@z.com";
    expect(ownerInboxList()).toEqual(["fallback@z.com"]);
  });

  it("returns empty array when nothing valid is set", () => {
    clearOwnerEnvs();
    expect(ownerInboxList()).toEqual([]);
  });
});
