"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  GitCommit,
  GitBranch,
  Flame,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import {
  calculateCadenceIndex,
  calculateCurrentStreak,
  calculateActiveDays,
  calculateLanguageDistribution,
} from "@/src/lib/metrics";

// Static calendar preview for the 22-week hero telemetry matrix (154 days)
const HERO_WEEKS_COUNT = 22;

export function WelcomeHeroConsole() {
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    count: number;
    dayName: string;
  } | null>(null);

  // Generate 22 weeks of deterministic calendar days
  const { weeks, summaryStats } = useMemo(() => {
    const list: Array<
      Array<{
        dateStr: string;
        dayName: string;
        month: string;
        isNewMonth: boolean;
        level: 0 | 1 | 2 | 3 | 4;
        count: number;
      }>
    > = [];

    const now = new Date(2026, 10, 5); // Reference anchor date
    const totalDays = HERO_WEEKS_COUNT * 7;
    let prevMonth = -1;

    const allDays = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      const dayOfWeek = d.getDay();
      const monthNum = d.getMonth();
      const isNewMonth = monthNum !== prevMonth;
      if (isNewMonth) prevMonth = monthNum;

      // Deterministic developer cadence pattern
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = (d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate() * 7) % 23;
      let count = 0;

      if (!isWeekend) {
        if (seed > 18) count = 8 + (seed % 6);
        else if (seed > 10) count = 4 + (seed % 4);
        else if (seed > 3) count = 1 + (seed % 3);
        else count = 0;
      } else {
        count = seed > 19 ? 2 : 0;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 5) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;

      allDays.push({
        dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        isNewMonth,
        level,
        count,
        commits: count,
      });
    }

    for (let w = 0; w < HERO_WEEKS_COUNT; w++) {
      list.push(allDays.slice(w * 7, (w + 1) * 7));
    }

    // Compute genuine metrics over the past 30 days using the shared metrics engine
    const last30 = allDays.slice(-30);
    const activeDays30 = calculateActiveDays(last30);
    const cadenceIndex = calculateCadenceIndex(activeDays30, 30);
    const streak = calculateCurrentStreak(allDays);
    const totalCommits = allDays.reduce((acc, d) => acc + d.count, 0);

    return {
      weeks: list,
      summaryStats: {
        cadenceIndex,
        activeDays30,
        streak,
        totalCommits,
      },
    };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
      {/* Console Titlebar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            devpulse://preview-console/telemetry-engine
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">SSE: stream active</span>
          <span className="text-border">|</span>
          <span className="text-foreground">worker: ready</span>
        </div>
      </div>

      {/* Top Readout Strip: Authentically calculated using src/lib/metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/60 border-b border-border">
        <div className="bg-card p-3 space-y-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Cadence Index
          </span>
          <p className="font-mono text-xl font-bold tracking-tight text-foreground tabular-nums">
            {summaryStats.cadenceIndex}%
          </p>
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {summaryStats.activeDays30} of 30 active days
          </span>
        </div>

        <div className="bg-card p-3 space-y-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Streak
          </span>
          <p className="font-mono text-xl font-bold tracking-tight text-foreground tabular-nums flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            {summaryStats.streak} Days
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            Consecutive commit days
          </span>
        </div>

        <div className="bg-card p-3 space-y-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Indexed Commits
          </span>
          <p className="font-mono text-xl font-bold tracking-tight text-foreground tabular-nums">
            {summaryStats.totalCommits}
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            22-week sample window
          </span>
        </div>

        <div className="bg-card p-3 space-y-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Source Retention
          </span>
          <p className="font-mono text-xl font-bold tracking-tight text-emerald-400 tabular-nums">
            0 Bytes
          </p>
          <span className="font-mono text-[10px] text-muted-foreground">
            Metadata scope only
          </span>
        </div>
      </div>

      {/* 22-Week Heatmap Grid */}
      <div className="p-4 sm:p-5 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Commit Rhythm &amp; Contribution Spectrum
            </h3>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            22-week sliding window
          </span>
        </div>

        <div className="overflow-x-auto pb-1 flex justify-center">
          <div className="w-fit">
            {/* Month labels */}
            <div className="flex text-[10px] font-mono text-muted-foreground mb-1 pl-6 w-full gap-1 select-none">
              {weeks.map((week, idx) => {
                const first = week[0];
                const show = idx % 4 === 0 || first?.isNewMonth;
                return (
                  <div key={idx} className="w-3 shrink-0 text-left overflow-visible">
                    {show ? first?.month : ""}
                  </div>
                );
              })}
            </div>

            {/* Matrix */}
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col justify-between h-[96px] text-[9px] font-mono text-muted-foreground pr-1 select-none leading-none">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div className="flex gap-1">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((day, dIdx) => {
                      let cellClass = "bg-surface-raised/40 border-border/40";
                      if (day.level === 1) cellClass = "bg-indigo-950/80 border-indigo-900/50 hover:bg-indigo-900";
                      else if (day.level === 2) cellClass = "bg-indigo-800/80 border-indigo-700/60 hover:bg-indigo-700";
                      else if (day.level === 3) cellClass = "bg-indigo-600 border-indigo-500/60 hover:bg-indigo-500";
                      else if (day.level === 4) cellClass = "bg-indigo-400 border-indigo-300 hover:bg-indigo-300";

                      const isSelected = hoveredCell?.dateStr === day.dateStr && hoveredCell?.dayName === day.dayName;

                      return (
                        <div
                          key={dIdx}
                          onMouseEnter={() =>
                            setHoveredCell({
                              dateStr: day.dateStr,
                              dayName: day.dayName,
                              count: day.count,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`h-3 w-3 rounded-[2px] border transition-transform cursor-pointer ${cellClass} ${
                            isSelected ? "scale-125 ring-1 ring-primary z-10" : "hover:scale-110"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Footer Legend & Hover Readout */}
        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-border/50 text-muted-foreground">
          <div className="truncate max-w-[260px] text-foreground">
            {hoveredCell ? (
              <span className="text-primary font-bold">
                {hoveredCell.count} {hoveredCell.count === 1 ? "commit" : "commits"} on {hoveredCell.dateStr} ({hoveredCell.dayName})
              </span>
            ) : (
              <span>Hover cell for date &amp; velocity telemetry</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] shrink-0">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-[2px] bg-surface-raised/40 border border-border/40" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-indigo-950/80 border border-indigo-900/50" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-indigo-800/80 border border-indigo-700/60" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-indigo-600 border border-indigo-500/60" />
            <span className="h-2.5 w-2.5 rounded-[2px] bg-indigo-400 border border-indigo-300" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Illustrative Sample Event Stream */}
      <div className="p-4 sm:p-5 space-y-3 bg-surface-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-primary" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Event Stream Preview (Simulated Ingestion)
            </h4>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Backoff algorithm: active
          </span>
        </div>

        <div className="divide-y divide-border/60 rounded-md border border-border bg-card">
          {[
            {
              sha: "7d94f2a",
              msg: "feat(queue): implement rate-limit adaptive backoff for GitHub API",
              repo: "telemetry-engine",
              author: "alex-chen",
              time: "12m ago",
            },
            {
              sha: "2c8e41f",
              msg: "fix(indexer): resolve language byte calculation for vendor submodules",
              repo: "core-api",
              author: "sarah-k",
              time: "48m ago",
            },
            {
              sha: "9f1d03c",
              msg: "perf(cache): serialize repository topography into in-memory cache",
              repo: "worker-pool",
              author: "marcus-v",
              time: "2h ago",
            },
          ].map((item) => (
            <div
              key={item.sha}
              className="p-2.5 sm:px-3.5 flex items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="font-bold text-foreground truncate max-w-[240px] sm:max-w-md">
                  {item.msg}
                </span>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="hidden sm:inline text-muted-foreground truncate">
                  {item.repo}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-muted-foreground text-[11px]">{item.time}</span>
                <span className="rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[11px] font-bold text-primary">
                  {item.sha}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Benchmark Archetypes Explorer: Pre-computed examples of how the metrics engine
// evaluates diverse engineering stacks
export function InteractiveSampleExplorer() {
  const [activeProfile, setActiveProfile] = useState<"monorepo" | "systems" | "frontend">("monorepo");

  const rawProfiles = {
    monorepo: {
      id: "monorepo",
      name: "Distributed Services Monorepo",
      org: "cloud-infrastructure",
      reposCount: 14,
      totalCommits: 3842,
      activeDays: 27, // out of 30
      streak: 28,
      rawLanguages: [
        { name: "TypeScript", bytes: 460000, color: "bg-indigo-500" },
        { name: "Rust", bytes: 320000, color: "bg-amber-500" },
        { name: "Go", bytes: 140000, color: "bg-cyan-500" },
        { name: "SQL", bytes: 80000, color: "bg-emerald-500" },
      ],
      recentCommits: [
        { sha: "8a10fbc", msg: "refactor(rpc): switch gRPC transport to HTTP/3 streams", repo: "gateway-proxy", time: "18m ago" },
        { sha: "4d91e32", msg: "chore(deps): update prisma client to 6.19.3 across packages", repo: "data-service", time: "1h ago" },
        { sha: "1c28b70", msg: "test(auth): add edge case suite for expired GitHub OAuth tokens", repo: "identity-api", time: "3h ago" },
      ],
      cadenceWave: [48, 72, 85, 92, 88, 96, 84, 91, 78, 86, 94, 98],
    },
    systems: {
      id: "systems",
      name: "Low-Latency Telemetry Engine",
      org: "kernel-runtime",
      reposCount: 6,
      totalCommits: 1920,
      activeDays: 24, // out of 30
      streak: 19,
      rawLanguages: [
        { name: "Rust", bytes: 680000, color: "bg-amber-500" },
        { name: "C++", bytes: 180000, color: "bg-indigo-500" },
        { name: "Python", bytes: 100000, color: "bg-emerald-500" },
        { name: "Shell", bytes: 40000, color: "bg-slate-500" },
      ],
      recentCommits: [
        { sha: "b371ac9", msg: "perf(alloc): zero-copy ringbuffer for high-throughput packet trace", repo: "telemetry-core", time: "24m ago" },
        { sha: "5f82d11", msg: "fix(simd): guard AVX-512 vector paths on ARM64 fallbacks", repo: "vector-engine", time: "2h ago" },
        { sha: "e091b48", msg: "ci(bench): automate weekly regression benchmark reports", repo: "infra-ci", time: "5h ago" },
      ],
      cadenceWave: [30, 45, 60, 75, 70, 88, 82, 90, 85, 78, 89, 92],
    },
    frontend: {
      id: "frontend",
      name: "Next.js & Edge Web Console",
      org: "design-platform",
      reposCount: 9,
      totalCommits: 2450,
      activeDays: 22, // out of 30
      streak: 14,
      rawLanguages: [
        { name: "TypeScript", bytes: 720000, color: "bg-indigo-500" },
        { name: "CSS / Tailwind", bytes: 180000, color: "bg-cyan-500" },
        { name: "Node.js", bytes: 100000, color: "bg-emerald-500" },
      ],
      recentCommits: [
        { sha: "7c12f0e", msg: "feat(a11y): add high-contrast keyboard focus indicators for heatmap", repo: "web-console", time: "42m ago" },
        { sha: "3d49e8a", msg: "perf(ssr): stream commit lists using React 19 Server Components", repo: "web-console", time: "3h ago" },
        { sha: "9a01f56", msg: "docs(tokens): standardize radius and surface token specifications", repo: "design-tokens", time: "7h ago" },
      ],
      cadenceWave: [55, 62, 70, 68, 74, 82, 79, 88, 91, 85, 87, 90],
    },
  };

  const currentRaw = rawProfiles[activeProfile];

  // Dynamically compute exact metrics using the metrics engine
  const computedCadence = calculateCadenceIndex(currentRaw.activeDays, 30);
  const languageOutputs = calculateLanguageDistribution(currentRaw.rawLanguages);
  const colorMap = new Map(currentRaw.rawLanguages.map((l) => [l.name, l.color]));

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Workspace Selection Tab Bar */}
      <div className="border-b border-border bg-surface-subtle p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Archetype Telemetry Inspector (Pre-computed Examples)
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-md border border-border bg-secondary">
          {[
            { id: "monorepo", label: "Microservices" },
            { id: "systems", label: "Systems / Rust" },
            { id: "frontend", label: "Next.js Console" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveProfile(tab.id as typeof activeProfile)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                activeProfile === tab.id
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Metrics Header */}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>Archetype: @{currentRaw.org}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Calculated via metrics engine
              </span>
            </div>
            <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
              {currentRaw.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <FaGithub className="h-3.5 w-3.5" />
              <span>Connect Your Repositories</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Connected Repos
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground tabular-nums">
              {currentRaw.reposCount}
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">Public &amp; Private</span>
          </div>

          <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Ingested Commits
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground tabular-nums">
              {currentRaw.totalCommits.toLocaleString()}
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">Historical volume</span>
          </div>

          <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Active Streak
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground tabular-nums flex items-center gap-1">
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
              {currentRaw.streak} Days
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">Traversed backward</span>
          </div>

          <div className="rounded-lg border border-border bg-surface-subtle p-3.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Cadence Rating
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-primary tabular-nums">
              {computedCadence}%
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">{currentRaw.activeDays} of 30 active days</span>
          </div>
        </div>

        {/* 2 Columns: Language Distribution + Commit Velocity Bar Chart */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Language Breakdown */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>Byte-Accurate Language Distribution</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">Calculated Byte Proportions</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {languageOutputs.map((lang) => (
                <div key={lang.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-foreground">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percentage}% of codebase</span>
                  </div>
                  <div className="h-2 rounded-sm bg-card border border-border overflow-hidden">
                    <div
                      className={`h-full ${colorMap.get(lang.name) || "bg-indigo-500"} transition-all duration-300`}
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commit Velocity Waveform */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span>Weekly Commit Velocity Waveform</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">12-week trend</span>
            </div>

            <div className="h-28 flex items-end gap-1.5 pt-4 pb-1 border-b border-border/40">
              {currentRaw.cadenceWave.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    className="w-full rounded-t-xs bg-primary/75 group-hover:bg-primary transition-all duration-300"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">
                    W{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-mono text-muted-foreground">
              Commit rhythm calculated from aggregated commit timestamps without code diff analysis.
            </p>
          </div>
        </div>

        {/* Recent Ingested Commits Table */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Representative Ingested Commit Ledger
          </span>
          <div className="divide-y divide-border rounded-md border border-border bg-surface-subtle">
            {currentRaw.recentCommits.map((item) => (
              <div
                key={item.sha}
                className="p-3 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-foreground truncate">{item.msg}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground truncate">{item.repo}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-muted-foreground text-[11px]">{item.time}</span>
                  <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[11px] text-primary">
                    {item.sha}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
