import { describe, expect, it } from "vitest";
import { checkDocsUrl } from "./checkDocs";

describe("checkDocsUrl", () => {
  it("links a built-in check to its section of the check reference", () => {
    expect(checkDocsUrl({ id: "failure_alerts", pack: "dagwick" })).toBe(
      "https://github.com/dagwick/dagwick/blob/main/docs/checks.md#failure_alerts",
    );
    expect(checkDocsUrl({ id: "retries" })).toBe(
      "https://github.com/dagwick/dagwick/blob/main/docs/checks.md#retries",
    );
  });

  it("has no link for a check pack's check, which Dagwick does not document", () => {
    expect(checkDocsUrl({ id: "acme_team_tag", pack: "acme-checks" })).toBeNull();
  });
});
