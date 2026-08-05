import "server-only";

type Entry = { timestamps: number[] };

const store = new Map<string, Entry>();

function cleanup(key: string, windowMs: number) {
  const entry = store.get(key);
  if (!entry) return;
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
  if (entry.timestamps.length === 0) store.delete(key);
}

/**
 * Best-effort in-memory rate limiter.
 * Suitable for a single-instance deployment; for multi-instance
 * production, swap this for a shared store (Redis/Upstash).
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  cleanup(key, windowMs);
  const entry = store.get(key) ?? { timestamps: [] };

  if (entry.timestamps.length >= limit) {
    return true;
  }

  entry.timestamps.push(Date.now());
  store.set(key, entry);
  return false;
}

export function resetRateLimit(key: string) {
  store.delete(key);
}
