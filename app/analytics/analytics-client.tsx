/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  GitCommit,
  Calendar,
  Clock,
  Zap,
  Trophy,
  Star,
  GitFork,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Code2,
  TrendingUp,
  CircleGauge,
} from "lucide-react";

interface CommitStats {
  totalCommits: number;
  monthlyCommits?: number;
  monthlycommits?: number;
  weeklyCommits: number;
  dailyCommits: number;
}

interface Language {
  id: string;
  name: string;
  bytes: number;
}

interface RankedRepo {
  id: string;
  name: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  _count: {
    commits: number;
  };
  languages: Language[];
}

interface RepoStats {
  repoRankings: RankedRepo[];
  mostActiveRepo: RankedRepo[];
}

interface User {
  id: string;
  name: string;
  email: string | null;
  username: string;
  avatarUrl: string | null;
}

interface TimelinePoint {
  date: string;
  label: string;
  commits: number;
}

interface Timeline {
  interval: "daily" | "weekly" | "monthly";
  total: number;
  average: number;
  latest: number;
  trend: "up" | "down" | "flat";
  series: TimelinePoint[];
}

interface LanguageAnalytics {
  totalBytes: number;
  languages: {
    name: string;
    bytes: number;
    repositories: number;
    percentage: number;
  }[];
}

interface RepositoryDistribution {
  id: string;
  name: string;
  commits: number;
  percentage: number;
}

interface DeveloperSummary {
  productivityScore: number;
  currentStreak: number;
  activeDays: number;
  topLanguage: LanguageAnalytics["languages"][number] | null;
}

function BarSeries({
  title,
  data,
  emptyText,
}: {
  title: string;
  data: Timeline | null;
  emptyText: string;
}) {
  const max = Math.max(...(data?.series.map((item) => item.commits) ?? [0]), 1);
  const glyphs = data?.series ?? [];

  if (!data || glyphs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/80 p-6">
        <p className="text-sm font-medium text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Avg {data.average}</span>
      </div>

      <div className="flex h-44 items-end gap-1.5">
        {glyphs.map((point) => (
          <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="w-full max-w-5 rounded-t-md bg-gradient-to-t from-primary/80 to-violet-400 transition-colors hover:from-primary"
              style={{ height: `${Math.max((point.commits / max) * 100, point.commits > 0 ? 10 : 2)}%` }}
              title={`${point.label}: ${point.commits} commits`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
        <span>{glyphs[0]?.label ?? "No data"}</span>
        <span>{glyphs[glyphs.length - 1]?.label ?? ""}</span>
      </div>
    </div>
  );
}

export function AnalyticsClient({ user }: { user: User }) {
  const [commitsData, setCommitsData] = useState<CommitStats | null>(null);
  const [reposData, setReposData] = useState<RepoStats | null>(null);
  const [dailyData, setDailyData] = useState<Timeline | null>(null);
  const [weeklyData, setWeeklyData] = useState<Timeline | null>(null);
  const [monthlyData, setMonthlyData] = useState<Timeline | null>(null);
  const [languageData, setLanguageData] = useState<LanguageAnalytics | null>(null);
  const [repositoryDistribution, setRepositoryDistribution] = useState<RepositoryDistribution[]>([]);
  const [summary, setSummary] = useState<DeveloperSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<"daily" | "weekly" | "monthly">("weekly");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const [commitsRes, reposRes, dailyRes, weeklyRes, monthlyRes, languagesRes, distributionRes, summaryRes] = await Promise.all([
          fetch("/api/analytics/commits"),
          fetch("/api/analytics/repos"),
          fetch("/api/analytics/commits/daily"),
          fetch("/api/analytics/commits/weekly"),
          fetch("/api/analytics/commits/monthly"),
          fetch("/api/analytics/languages"),
          fetch("/api/analytics/repository-distribution"),
          fetch("/api/analytics/summary"),
        ]);

        if (!commitsRes.ok || !reposRes.ok || !dailyRes.ok || !weeklyRes.ok || !monthlyRes.ok || !languagesRes.ok || !distributionRes.ok || !summaryRes.ok) {
          throw new Error("Failed to fetch analytics statistics");
        }

        const commitsJson = await commitsRes.json();
        const reposJson = await reposRes.json();
        const dailyJson = await dailyRes.json();
        const weeklyJson = await weeklyRes.json();
        const monthlyJson = await monthlyRes.json();
        const languagesJson = await languagesRes.json();
        const distributionJson = await distributionRes.json();
        const summaryJson = await summaryRes.json();

        if (commitsJson.success) setCommitsData(commitsJson.data);
        if (reposJson.success) setReposData(reposJson.data);
        if (dailyJson.success) setDailyData(dailyJson.data);
        if (weeklyJson.success) setWeeklyData(weeklyJson.data);
        if (monthlyJson.success) setMonthlyData(monthlyJson.data);
        if (languagesJson.success) setLanguageData(languagesJson.data);
        if (distributionJson.success) setRepositoryDistribution(distributionJson.data);
        if (summaryJson.success) setSummary(summaryJson.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="h-24 rounded-xl border border-border/40 bg-card/40" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-xl border border-border/40 bg-card/40" />
          ))}
        </div>
        <div className="h-96 rounded-xl border border-border/40 bg-card/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-lg font-bold text-foreground">Analytics Unreachable</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const topRepo = reposData?.mostActiveRepo?.[0] || null;
  const rankings = reposData?.repoRankings || [];
  const monthlyCommits = commitsData?.monthlyCommits ?? commitsData?.monthlycommits ?? 0;
  const selectedTimeline = selectedRange === "daily" ? dailyData : selectedRange === "weekly" ? weeklyData : monthlyData;

  const summaryCards = summary
    ? [
        { label: "Productivity Score", value: `${summary.productivityScore} / 100`, icon: CircleGauge, note: "Based on synced activity patterns" },
        { label: "Commit Streak", value: `${summary.currentStreak} days`, icon: Zap, note: "Current streak" },
        { label: "Active Days", value: `${summary.activeDays}`, icon: Calendar, note: "Active in last 30 days" },
        { label: "Top Language", value: summary.topLanguage?.name ?? "None", icon: Code2, note: "Most-used language" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="dp-label mb-2">Developer insights</p>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <BarChart3 className="h-8 w-8 text-indigo-500" />
            GitHub Analytics
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Monitor contribution patterns for {user.name || user.username}.</p>
        </div>

        {user.avatarUrl && <img src={user.avatarUrl} alt={user.name || user.username} className="h-12 w-12 rounded-full border border-border object-cover" />}
      </header>

      {commitsData && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Commits", value: commitsData.totalCommits, icon: GitCommit, color: "text-indigo-500", desc: "All-time synced commits" },
            { label: "Last 30 Days", value: monthlyCommits, icon: Calendar, color: "text-violet-500", desc: "Recent activity" },
            { label: "Last 7 Days", value: commitsData.weeklyCommits, icon: Clock, color: "text-sky-500", desc: "Weekly activity" },
            { label: "Commits Today", value: commitsData.dailyCommits, icon: Zap, color: "text-amber-500", desc: "Current-day activity" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</span>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className="dp-metric-value mt-3 text-3xl">{item.value}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border bg-card/80 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</span>
                  <Icon className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.note}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="dp-label">Commit activity</p>
            <h2 className="mt-1 text-xl font-bold text-foreground">Development activity</h2>
          </div>

          <div className="inline-flex gap-2 rounded-md border border-border bg-secondary/70 p-1">
            {(["daily", "weekly", "monthly"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  selectedRange === range ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 rounded-md border border-border/80 bg-secondary/35 p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Productivity score:</span> {summary ? `${summary.productivityScore} / 100` : "Unavailable"}. Based on synced activity, active days, and repository engagement patterns in the current dataset.
        </div>

        <BarSeries
          title={`${selectedRange.charAt(0).toUpperCase() + selectedRange.slice(1)} commit activity`}
          data={selectedTimeline}
          emptyText="No activity data yet. Sync your GitHub repositories to establish a development history."
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
        <div className="md:col-span-2 overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm">
          <div className="border-b border-border/60 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Trophy className="h-5 w-5 text-amber-500" />
              Top Active Repositories
            </h2>
          </div>

          <div className="space-y-3 p-4">
            {rankings.length === 0 ? (
              <p className="p-4 text-sm font-medium text-muted-foreground">No repository ranking data found. Sync your GitHub data to populate this list.</p>
            ) : (
              rankings.map((repo, idx) => {
                const rankStyle = ["bg-amber-500/10 text-amber-600 border-amber-500/20", "bg-slate-500/10 text-slate-400 border-slate-500/20", "bg-amber-700/10 text-amber-700 border-amber-700/20"]; 
                return (
                  <div key={repo.id} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-3 transition-colors hover:bg-secondary/35">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${rankStyle[idx % rankStyle.length]}`}>
                      #{idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link href={`/repositories/${repo.id}`} className="flex items-center gap-1.5 text-base font-bold text-foreground hover:text-primary">
                          <span>{repo.name}</span>
                          <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity hover:opacity-100" />
                        </Link>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <GitCommit className="h-3.5 w-3.5 text-violet-500" />
                          {repo._count.commits} commits
                        </span>
                      </div>

                      {repo.languages && repo.languages.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {repo.languages.slice(0, 4).map((language) => (
                            <span key={language.id} className="rounded-md border border-border bg-card px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                              {language.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-600 dark:text-indigo-400">
            <Trophy className="h-4 w-4" />
            Most Active Repository
          </div>

          {topRepo ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">{topRepo.name}</h3>
              <p className="text-sm text-muted-foreground">This repository has the strongest sync footprint in your current dataset.</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border border-border bg-secondary/35 p-2 text-center">
                  <Star className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                  <p className="text-sm font-bold text-foreground">{topRepo.stars}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Stars</p>
                </div>
                <div className="rounded-md border border-border bg-secondary/35 p-2 text-center">
                  <GitFork className="mx-auto mb-1 h-4 w-4 text-indigo-500" />
                  <p className="text-sm font-bold text-foreground">{topRepo.forks}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Forks</p>
                </div>
                <div className="rounded-md border border-border bg-secondary/35 p-2 text-center">
                  <GitCommit className="mx-auto mb-1 h-4 w-4 text-violet-500" />
                  <p className="text-sm font-bold text-foreground">{topRepo._count.commits}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Commits</p>
                </div>
              </div>

              <Link href={`/repositories/${topRepo.id}`} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
                Analyze Repository
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Connect and sync repositories in the Dashboard to surface the most active repository.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
            <Code2 className="h-5 w-5 text-pink-500" />
            Language Distribution
          </h2>

          {languageData && languageData.languages.length > 0 ? (
            <div className="space-y-4">
              <div className="flex h-3 overflow-hidden rounded-full border border-border bg-secondary">
                {languageData.languages.slice(0, 8).map((language, index) => {
                  const colors = ["bg-indigo-500", "bg-violet-500", "bg-amber-400", "bg-emerald-500", "bg-pink-500", "bg-sky-400", "bg-rose-500", "bg-lime-500"];
                  return (
                    <div key={language.name} className={colors[index % colors.length]} style={{ width: `${language.percentage}%` }} title={`${language.name}: ${language.percentage}%`} />
                  );
                })}
              </div>

              <div className="space-y-3">
                {languageData.languages.slice(0, 8).map((language) => (
                  <div key={language.name} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs font-bold">
                      <span className="text-foreground">{language.name}</span>
                      <span className="text-muted-foreground">{language.percentage}% · {language.repositories} repos</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-indigo-500" style={{ width: `${language.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">No language data available yet. Sync repositories to populate the language breakdown.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Repository Commit Distribution
          </h2>

          {repositoryDistribution.length > 0 ? (
            <div className="space-y-3">
              {repositoryDistribution.slice(0, 8).map((repository) => (
                <div key={repository.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold">
                    <span className="truncate text-foreground">{repository.name}</span>
                    <span className="whitespace-nowrap text-muted-foreground">{repository.commits} commits</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${repository.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">No repository distribution data found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
