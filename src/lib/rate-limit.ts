import { createHash } from "node:crypto";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 4;
type Entry = { count: number; resetAt: number };
const globalWithLimits = globalThis as typeof globalThis & { __oauthGuideLimits?: Map<string, Entry> };
const limits = globalWithLimits.__oauthGuideLimits ?? (globalWithLimits.__oauthGuideLimits = new Map());

export function checkGenerationLimit(address: string): { allowed: boolean; retryAfter: number } {
  if (process.env.NODE_ENV !== "production") return { allowed: true, retryAfter: 0 };
  const now = Date.now();
  for (const [key, value] of limits) if (value.resetAt <= now) limits.delete(key);
  const hash = createHash("sha256").update(address).digest("hex");
  const current = limits.get(hash);
  if (!current || current.resetAt <= now) {
    limits.set(hash, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_REQUESTS) return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}
