type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const globalCache = globalThis as typeof globalThis & {
  devpulseCache?: Map<string, CacheEntry<unknown>>;
};

const cache = globalCache.devpulseCache ?? new Map<string, CacheEntry<unknown>>();
globalCache.devpulseCache = cache;

export async function cached<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
) {
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = await loader();
  cache.set(key, {
    value,
    expiresAt: now + ttlMs,
  });

  return value;
}

export function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
