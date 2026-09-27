import type { AstroSession } from "astro";

import type { Source } from "./config";
import type { StarlightLatestVersionContext } from "./version";

const cacheExpirationMs = 60 * 60 * 1000;

export async function getCachedVersion(
  session: AstroSession | undefined,
  source: Source,
  fetchVersion: () => Promise<StarlightLatestVersionContext>
): Promise<StarlightLatestVersionContext> {
  const cacheKey = getCacheKey(source);
  const cacheEntry = parseCacheEntry(await session?.get(cacheKey));

  if (cacheEntry && isCacheEntryFresh(cacheEntry, Date.now())) {
    return cacheEntry.context;
  }

  const context = await fetchVersion();
  session?.set(cacheKey, serializeCacheEntry(context, Date.now()));

  return context;
}

export function isCacheEntryFresh(entry: CacheEntry, now: number): boolean {
  return now - entry.timestamp < cacheExpirationMs;
}

function getCacheKey(source: Source): string {
  return `versionCache:${source.type}:${source.slug}`;
}

function parseCacheEntry(value: unknown): CacheEntry | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  try {
    return JSON.parse(value) as CacheEntry;
  } catch {
    return undefined;
  }
}

function serializeCacheEntry(
  context: StarlightLatestVersionContext,
  timestamp: number
): string {
  return JSON.stringify({ timestamp, context } satisfies CacheEntry);
}

interface CacheEntry {
  timestamp: number;
  context: StarlightLatestVersionContext;
}
