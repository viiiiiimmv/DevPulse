/**
 * DevPulse Metrics & Telemetry Calculation Engine
 *
 * Explicit, defensible mathematical definitions for all telemetry signals
 * displayed across the welcome page and dashboard.
 */

export interface DailyPoint {
  date: string;
  commits: number;
}

export interface LanguageByteInput {
  name: string;
  bytes: number;
  repositories?: number | Set<string>;
}

export interface LanguageDistributionOutput {
  name: string;
  bytes: number;
  percentage: number;
  repositories: number;
}

/**
 * Cadence Index Formula:
 * The percentage of days within a sliding evaluation window that had at least one commit.
 *
 * Formula:
 *   Cadence Index (%) = (Active Days / Total Window Days) * 100
 *   Clamped to [0, 100].
 *
 * Edge cases:
 *   - windowDays <= 0: returns 0
 *   - activeDays > windowDays: clamped to 100
 *   - activeDays = 0: returns 0
 */
export function calculateCadenceIndex(activeDays: number, windowDays = 30): number {
  if (windowDays <= 0 || activeDays <= 0) {
    return 0;
  }
  const raw = (activeDays / windowDays) * 100;
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

/**
 * Active Days Formula:
 * Counts the total number of distinct days in the series where commits >= 1.
 */
export function calculateActiveDays(series: { commits: number }[]): number {
  if (!series || !Array.isArray(series)) {
    return 0;
  }
  return series.filter((item) => typeof item?.commits === "number" && item.commits > 0).length;
}

/**
 * Consecutive Active Day Streak Formula:
 * Traverses backward from the most recent day in the series.
 * Increments the streak count for each contiguous day with commits >= 1.
 * Stops immediately at the first day where commits == 0.
 *
 * Edge cases:
 *   - Empty series: returns 0
 *   - Today has 0 commits: returns 0 (streak broken)
 *   - All days active: returns series.length
 */
export function calculateCurrentStreak(series: { commits: number }[]): number {
  if (!series || !Array.isArray(series) || series.length === 0) {
    return 0;
  }

  let streak = 0;
  for (let i = series.length - 1; i >= 0; i--) {
    const day = series[i];
    if (day && typeof day.commits === "number" && day.commits > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Productivity Score Formula:
 * Multi-factor heuristic score combining commit volume, consistency, project breadth, and language diversity:
 *
 *   Score = min(100, round(
 *     (weeklyCommits * 6) +
 *     (activeDays * 2) +
 *     (repoCount * 4) +
 *     (min(languageCount, 10) * 2)
 *   ))
 *
 * Edge cases:
 *   - All inputs 0: returns 0
 *   - Large numbers: clamped to 100
 */
export function calculateProductivityScore(params: {
  weeklyCommits: number;
  activeDays: number;
  repoCount: number;
  languageCount: number;
}): number {
  const { weeklyCommits = 0, activeDays = 0, repoCount = 0, languageCount = 0 } = params;

  const raw =
    Math.max(0, weeklyCommits) * 6 +
    Math.max(0, activeDays) * 2 +
    Math.max(0, repoCount) * 4 +
    Math.min(Math.max(0, languageCount), 10) * 2;

  return Math.min(100, Math.round(raw));
}

/**
 * Byte-Accurate Language Distribution Formula:
 * Calculates proportion of total codebase syntax volume from GitHub API byte counts.
 *
 * Formula for language i:
 *   Percentage_i = (Bytes_i / TotalBytes) * 100
 *
 * Edge cases:
 *   - Empty array: returns []
 *   - TotalBytes == 0: returns 0% for all items
 *   - Sorted descending by bytes volume
 */
export function calculateLanguageDistribution(
  inputs: LanguageByteInput[],
): LanguageDistributionOutput[] {
  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    return [];
  }

  // Aggregate duplicate names if any
  const totals = new Map<string, { bytes: number; repoCount: number }>();
  let totalBytes = 0;

  for (const item of inputs) {
    if (!item?.name) continue;
    const bytes = Math.max(0, Number(item.bytes) || 0);
    const existing = totals.get(item.name) ?? { bytes: 0, repoCount: 0 };
    existing.bytes += bytes;

    const repCount =
      typeof item.repositories === "number"
        ? item.repositories
        : item.repositories instanceof Set
          ? item.repositories.size
          : 1;

    existing.repoCount = Math.max(existing.repoCount, repCount);
    totals.set(item.name, existing);
    totalBytes += bytes;
  }

  return Array.from(totals.entries())
    .map(([name, data]) => ({
      name,
      bytes: data.bytes,
      repositories: data.repoCount,
      percentage:
        totalBytes > 0 ? Number(((data.bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

/**
 * Timeline Velocity Trend Determination:
 * Compares latest period commits to immediate prior period.
 */
export function calculateVelocityTrend(
  series: { commits: number }[],
): "up" | "down" | "flat" {
  if (!series || series.length < 2) {
    return "flat";
  }

  const latest = series.at(-1)?.commits ?? 0;
  const previous = series.at(-2)?.commits ?? 0;

  if (latest > previous) return "up";
  if (latest < previous) return "down";
  return "flat";
}

/**
 * Repository Commit Share Percentage Formula:
 * Percentage_repo = (RepoCommits / TotalCommits) * 100
 */
export function calculateRepositoryDistribution(
  repos: { id: string; name: string; commits: number }[],
): { id: string; name: string; commits: number; percentage: number }[] {
  if (!repos || repos.length === 0) {
    return [];
  }

  const total = repos.reduce((acc, r) => acc + Math.max(0, r.commits || 0), 0);

  return repos.map((r) => ({
    id: r.id,
    name: r.name,
    commits: Math.max(0, r.commits || 0),
    percentage:
      total > 0
        ? Number(((Math.max(0, r.commits || 0) / total) * 100).toFixed(1))
        : 0,
  }));
}

