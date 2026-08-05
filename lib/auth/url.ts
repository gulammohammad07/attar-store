import "server-only";

/**
 * Returns a same-origin, relative redirect target. Anything that could be
 * an open redirect (absolute URLs, protocol-relative, backslashes, etc.)
 * falls back to the provided default.
 */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/account",
): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes(":") ||
    trimmed.includes("\\") ||
    trimmed.includes("%0d") ||
    trimmed.includes("%0a")
  ) {
    return fallback;
  }
  return trimmed;
}
