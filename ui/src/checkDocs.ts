import type { CheckResult } from "./types";

export const CHECKS_DOCS_URL = "https://github.com/dagwick/dagwick/blob/main/docs/checks.md";

/** The check's section in Dagwick's check reference (built-in checks only). */
export function checkDocsUrl(check: Pick<CheckResult, "id" | "pack">): string | null {
  if (check.pack && check.pack !== "dagwick") return null;
  return `${CHECKS_DOCS_URL}#${encodeURIComponent(check.id)}`;
}
