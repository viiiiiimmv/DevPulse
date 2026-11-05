import test, { describe } from "node:test";
import assert from "node:assert/strict";

import { cached, invalidateCache } from "../src/services/cache.service.ts";

describe("Cache Service Unit Tests", () => {
  test("caches and returns value without re-calling loader within TTL", async () => {
    let callCount = 0;
    const loader = async () => {
      callCount += 1;
      return { data: "test-payload", count: callCount };
    };

    const first = await cached("test:key:1", 5000, loader);
    assert.strictEqual(first.count, 1);

    const second = await cached("test:key:1", 5000, loader);
    assert.strictEqual(second.count, 1);
    assert.strictEqual(callCount, 1);
  });

  test("invalidates cached entries by prefix", async () => {
    let counterA = 0;
    let counterB = 0;

    await cached("github:repos:user1", 10000, async () => ++counterA);
    await cached("github:repos:user2", 10000, async () => ++counterA);
    await cached("other:user1", 10000, async () => ++counterB);

    assert.strictEqual(counterA, 2);
    assert.strictEqual(counterB, 1);

    // Invalidate github:repos:
    invalidateCache("github:repos:");

    // Re-accessing should trigger loader again
    await cached("github:repos:user1", 10000, async () => ++counterA);
    assert.strictEqual(counterA, 3);

    // other:user1 should still be cached
    await cached("other:user1", 10000, async () => ++counterB);
    assert.strictEqual(counterB, 1);
  });
});

