import test, { describe } from "node:test";
import assert from "node:assert/strict";

import {
  calculateCadenceIndex,
  calculateActiveDays,
  calculateCurrentStreak,
  calculateProductivityScore,
  calculateLanguageDistribution,
  calculateVelocityTrend,
  calculateRepositoryDistribution,
} from "../src/lib/metrics.ts";

describe("Cadence Index Calculation", () => {
  test("calculates exact ratio for normal 30-day window", () => {
    // 15 active days out of 30 days = 50%
    assert.strictEqual(calculateCadenceIndex(15, 30), 50);
    // 21 active days out of 30 days = 70%
    assert.strictEqual(calculateCadenceIndex(21, 30), 70);
    // 28 active days out of 30 days = 93.3%
    assert.strictEqual(calculateCadenceIndex(28, 30), 93.3);
  });

  test("handles edge cases: zero active days, negative values, and window bounds", () => {
    assert.strictEqual(calculateCadenceIndex(0, 30), 0);
    assert.strictEqual(calculateCadenceIndex(-5, 30), 0);
    assert.strictEqual(calculateCadenceIndex(15, 0), 0);
    assert.strictEqual(calculateCadenceIndex(15, -10), 0);
  });

  test("clamps output at 100% when active days exceed window", () => {
    assert.strictEqual(calculateCadenceIndex(35, 30), 100);
    assert.strictEqual(calculateCadenceIndex(30, 30), 100);
  });
});

describe("Active Days Calculation", () => {
  test("counts days with commits >= 1 and ignores zero-commit days", () => {
    const series = [
      { commits: 0 },
      { commits: 5 },
      { commits: 0 },
      { commits: 1 },
      { commits: 12 },
    ];
    assert.strictEqual(calculateActiveDays(series), 3);
  });

  test("handles empty series and all-zero days", () => {
    assert.strictEqual(calculateActiveDays([]), 0);
    assert.strictEqual(
      calculateActiveDays([{ commits: 0 }, { commits: 0 }, { commits: 0 }]),
      0,
    );
  });
});

describe("Streak Calculation (Backwards Traversal)", () => {
  test("counts consecutive days backwards until first zero-commit day", () => {
    const series = [
      { commits: 3 },
      { commits: 0 },
      { commits: 2 },
      { commits: 5 },
      { commits: 1 }, // today
    ];
    assert.strictEqual(calculateCurrentStreak(series), 3);
  });

  test("returns 0 if today has zero commits", () => {
    const series = [
      { commits: 5 },
      { commits: 8 },
      { commits: 0 }, // today
    ];
    assert.strictEqual(calculateCurrentStreak(series), 0);
  });

  test("returns full length if every day in window has commits", () => {
    const series = [
      { commits: 1 },
      { commits: 2 },
      { commits: 3 },
      { commits: 4 },
      { commits: 5 },
    ];
    assert.strictEqual(calculateCurrentStreak(series), 5);
  });

  test("handles empty series", () => {
    assert.strictEqual(calculateCurrentStreak([]), 0);
  });
});

describe("Productivity Score Calculation", () => {
  test("computes balanced multi-factor score", () => {
    // 5 weekly commits * 6 = 30
    // 10 active days * 2 = 20
    // 3 repos * 4 = 12
    // 4 languages * 2 = 8
    // Total = 70
    const score = calculateProductivityScore({
      weeklyCommits: 5,
      activeDays: 10,
      repoCount: 3,
      languageCount: 4,
    });
    assert.strictEqual(score, 70);
  });

  test("clamps at 100 for high-volume developers", () => {
    const score = calculateProductivityScore({
      weeklyCommits: 50,
      activeDays: 30,
      repoCount: 20,
      languageCount: 15,
    });
    assert.strictEqual(score, 100);
  });

  test("returns 0 for brand new user with 0 stats", () => {
    const score = calculateProductivityScore({
      weeklyCommits: 0,
      activeDays: 0,
      repoCount: 0,
      languageCount: 0,
    });
    assert.strictEqual(score, 0);
  });
});

describe("Byte-Accurate Language Distribution", () => {
  test("calculates proportional percentages sorted descending", () => {
    const input = [
      { name: "TypeScript", bytes: 600, repositories: 2 },
      { name: "Rust", bytes: 300, repositories: 1 },
      { name: "Go", bytes: 100, repositories: 1 },
    ];
    const distribution = calculateLanguageDistribution(input);

    assert.strictEqual(distribution.length, 3);
    assert.strictEqual(distribution[0]?.name, "TypeScript");
    assert.strictEqual(distribution[0]?.percentage, 60);
    assert.strictEqual(distribution[1]?.name, "Rust");
    assert.strictEqual(distribution[1]?.percentage, 30);
    assert.strictEqual(distribution[2]?.name, "Go");
    assert.strictEqual(distribution[2]?.percentage, 10);
  });

  test("aggregates duplicate language entries across multiple repositories", () => {
    const input = [
      { name: "TypeScript", bytes: 200, repositories: 1 },
      { name: "TypeScript", bytes: 300, repositories: 2 },
      { name: "Python", bytes: 500, repositories: 1 },
    ];
    const distribution = calculateLanguageDistribution(input);

    assert.strictEqual(distribution.length, 2);
    // 500 bytes each -> 50% each
    assert.strictEqual(distribution[0]?.bytes, 500);
    assert.strictEqual(distribution[0]?.percentage, 50);
    assert.strictEqual(distribution[1]?.bytes, 500);
    assert.strictEqual(distribution[1]?.percentage, 50);
  });

  test("handles empty inputs and zero byte repositories", () => {
    assert.deepStrictEqual(calculateLanguageDistribution([]), []);
    const zeroBytes = calculateLanguageDistribution([
      { name: "TypeScript", bytes: 0 },
      { name: "Rust", bytes: 0 },
    ]);
    assert.strictEqual(zeroBytes.length, 2);
    assert.strictEqual(zeroBytes[0]?.percentage, 0);
    assert.strictEqual(zeroBytes[1]?.percentage, 0);
  });
});

describe("Timeline Velocity Trend Determination", () => {
  test("identifies up, down, and flat trajectory", () => {
    assert.strictEqual(
      calculateVelocityTrend([{ commits: 5 }, { commits: 10 }]),
      "up",
    );
    assert.strictEqual(
      calculateVelocityTrend([{ commits: 10 }, { commits: 4 }]),
      "down",
    );
    assert.strictEqual(
      calculateVelocityTrend([{ commits: 8 }, { commits: 8 }]),
      "flat",
    );
    assert.strictEqual(calculateVelocityTrend([{ commits: 5 }]), "flat");
    assert.strictEqual(calculateVelocityTrend([]), "flat");
  });
});

describe("Repository Distribution", () => {
  test("computes percentage share per repository", () => {
    const repos = [
      { id: "1", name: "repo-a", commits: 75 },
      { id: "2", name: "repo-b", commits: 25 },
    ];
    const res = calculateRepositoryDistribution(repos);
    assert.strictEqual(res[0]?.percentage, 75);
    assert.strictEqual(res[1]?.percentage, 25);
  });

  test("handles empty repositories list", () => {
    assert.deepStrictEqual(calculateRepositoryDistribution([]), []);
  });
});
