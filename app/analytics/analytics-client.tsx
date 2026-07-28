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
  TrendingUp
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

function BarSeries({ title, data }: { title: string; data: Timeline | null }) {
  const max = Math.max(...(data?.series.map((item) => item.commits) ?? [0]), 1);

  return (
    <div className="border border-border/40 bg-card/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
        {data && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Avg {data.average}
          </span>
        )}
      </div>
      <div className="h-44 flex items-end gap-1.5">
        {(data?.series ?? []).map((point) => (
          <div key={point.date} className="flex-1 min-w-0 flex flex-col items-center gap-2">
            <div
              className="w-full max-w-5 rounded-t-md bg-indigo-500/80 hover:bg-indigo-500 transition-colors"
              style={{ height: `${Math.max((point.commits / max) * 100, point.commits > 0 ? 8 : 2)}%` }}
              title={`${point.label}: ${point.commits} commits`}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-semibold text-muted-foreground">
        <span>{data?.series[0]?.label ?? "No data"}</span>
        <span>{data?.series.at(-1)?.label ?? ""}</span>
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

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const [
          commitsRes,
          reposRes,
          dailyRes,
          weeklyRes,
          monthlyRes,
          languagesRes,
          distributionRes,
          summaryRes,
        ] = await Promise.all([
          fetch("/api/analytics/commits"),
          fetch("/api/analytics/repos"),
          fetch("/api/analytics/commits/daily"),
          fetch("/api/analytics/commits/weekly"),
          fetch("/api/analytics/commits/monthly"),
          fetch("/api/analytics/languages"),
          fetch("/api/analytics/repository-distribution"),
          fetch("/api/analytics/summary"),
        ]);

        if (
          !commitsRes.ok ||
          !reposRes.ok ||
          !dailyRes.ok ||
          !weeklyRes.ok ||
          !monthlyRes.ok ||
          !languagesRes.ok ||
          !distributionRes.ok ||
          !summaryRes.ok
        ) {
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

        if (commitsJson.success) {
          setCommitsData(commitsJson.data);
        }
        if (reposJson.success) {
          setReposData(reposJson.data);
        }
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-24 bg-card/40 border border-border/20 rounded-2xl" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-card/40 border border-border/20 rounded-2xl" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-card/40 border border-border/20 rounded-2xl" />
          <div className="h-96 bg-card/40 border border-border/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Analytics Unreachable</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {error || "We encountered an issue fetching your commit activity. Please make sure database is initialized and retry."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const topRepo = reposData?.mostActiveRepo?.[0] || null;
  const rankings = reposData?.repoRankings || [];
  const monthlyCommits = commitsData?.monthlyCommits ?? commitsData?.monthlycommits ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="border-b border-border/45 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            <span>GitHub Analytics</span>
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Monitor and visualize activity logs for {user.name} ({user.username}).
          </p>
        </div>
        {user.avatarUrl && (
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-12 h-12 rounded-full border border-border/40 shadow-sm"
          />
        )}
      </div>

      {/* Commit Counters Grid */}
      {commitsData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Commits", value: commitsData.totalCommits, icon: GitCommit, color: "text-indigo-500", desc: "All-time synced commits" },
            { label: "Last 30 Days", value: monthlyCommits, icon: Calendar, color: "text-violet-500", desc: "Commits in last 30 days" },
            { label: "Last 7 Days", value: commitsData.weeklyCommits, icon: Clock, color: "text-sky-500", desc: "Commits in last week" },
            { label: "Commits Today", value: commitsData.dailyCommits, icon: Zap, color: "text-amber-500", desc: "Commits pushed today" }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-3xl font-extrabold mt-3 text-foreground tracking-tight">{item.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground mt-2">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Developer Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Productivity Score", value: summary.productivityScore, icon: TrendingUp, color: "text-emerald-500" },
            { label: "Commit Streak", value: `${summary.currentStreak}d`, icon: Zap, color: "text-amber-500" },
            { label: "Active Days", value: summary.activeDays, icon: Calendar, color: "text-sky-500" },
            { label: "Top Language", value: summary.topLanguage?.name ?? "None", icon: Code2, color: "text-pink-500" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="border border-border/40 bg-card/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="text-2xl font-extrabold text-foreground mt-3 truncate">{item.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Commit Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarSeries title="Daily Commit Activity" data={dailyData} />
        <BarSeries title="Weekly Commit Activity" data={weeklyData} />
        <BarSeries title="Monthly Commit Activity" data={monthlyData} />
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Repo Activity Rankings */}
        <div className="md:col-span-2 border border-border/40 rounded-2xl bg-card/60 backdrop-blur-md shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-border/40">
            <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top Active Repositories</span>
            </h2>
          </div>
          
          <div className="p-5 space-y-6">
            {rankings.length === 0 ? (
              <p className="text-sm text-muted-foreground font-semibold py-4">No repository data found. Try syncing GitHub data.</p>
            ) : (
              rankings.map((repo, idx) => {
                const rankColors = ["text-amber-500 bg-amber-500/10 border-amber-500/20", "text-slate-400 bg-slate-500/10 border-slate-500/20", "text-amber-700 bg-amber-700/10 border-amber-700/20"];
                const badgeStyle = rankColors[idx] || "text-muted-foreground bg-secondary/80 border-border/20";
                
                return (
                  <div key={repo.id} className="flex items-start gap-4 p-4 border border-border/30 bg-card/30 rounded-xl hover:bg-card/75 hover:border-primary/20 hover:shadow-sm transition-all duration-200 group">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${badgeStyle} flex-shrink-0`}>
                      #{idx + 1}
                    </span>
                    
                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <Link 
                          href={`/repositories/${repo.id}`}
                          className="font-bold text-foreground group-hover:text-primary transition-colors text-base flex items-center gap-1.5"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <GitCommit className="w-3.5 h-3.5 text-violet-500" />
                            <span>{repo._count.commits} commits</span>
                          </span>
                        </div>
                      </div>

                      {/* Languages */}
                      {repo.languages && repo.languages.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {repo.languages.slice(0, 4).map(lang => (
                            <span key={lang.id} className="px-2 py-0.5 rounded-md bg-secondary/80 text-[10px] font-semibold text-muted-foreground border border-border/20">
                              {lang.name}
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

        {/* Featured Repo Spotlight */}
        <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-indigo-500 animate-bounce" />
              <span>Most Active Repository</span>
            </h2>
            
            {topRepo ? (
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  {topRepo.name}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  This repository has accumulated the highest commit frequency in your workspace profile.
                </p>
                
                <div className="grid grid-cols-3 gap-2 pt-4">
                  <div className="bg-card/60 border border-border/30 rounded-xl p-2.5 text-center">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <span className="text-xs font-bold block text-foreground">{topRepo.stars}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Stars</span>
                  </div>
                  <div className="bg-card/60 border border-border/30 rounded-xl p-2.5 text-center">
                    <GitFork className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                    <span className="text-xs font-bold block text-foreground">{topRepo.forks}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Forks</span>
                  </div>
                  <div className="bg-card/60 border border-border/30 rounded-xl p-2.5 text-center">
                    <GitCommit className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                    <span className="text-xs font-bold block text-foreground">{topRepo._count.commits}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Commits</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/repositories/${topRepo.id}`}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Analyze Repository</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                Connect and sync repositories in your Dashboard to highlight your active profiles here.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border/40 rounded-2xl bg-card/60 p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground tracking-tight mb-5 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-pink-500" />
            <span>Language Distribution</span>
          </h2>
          {languageData && languageData.languages.length > 0 ? (
            <div className="space-y-4">
              <div className="flex h-3 rounded-full overflow-hidden bg-secondary border border-border/30">
                {languageData.languages.slice(0, 8).map((language, index) => {
                  const colors = ["bg-indigo-500", "bg-violet-500", "bg-amber-400", "bg-emerald-500", "bg-pink-500", "bg-sky-400", "bg-rose-500", "bg-lime-500"];
                  return (
                    <div
                      key={language.name}
                      className={colors[index % colors.length]}
                      style={{ width: `${language.percentage}%` }}
                      title={`${language.name}: ${language.percentage}%`}
                    />
                  );
                })}
              </div>
              <div className="space-y-3">
                {languageData.languages.slice(0, 8).map((language) => (
                  <div key={language.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground">{language.name}</span>
                      <span className="text-muted-foreground">{language.percentage}% across {language.repositories} repos</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${language.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-semibold">No language data found. Sync repositories to populate language analytics.</p>
          )}
        </div>

        <div className="border border-border/40 rounded-2xl bg-card/60 p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground tracking-tight mb-5 flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-500" />
            <span>Repository Commit Distribution</span>
          </h2>
          {repositoryDistribution.length > 0 ? (
            <div className="space-y-3">
              {repositoryDistribution.slice(0, 8).map((repository) => (
                <div key={repository.id} className="space-y-1.5">
                  <div className="flex justify-between gap-3 text-xs font-bold">
                    <span className="text-foreground truncate">{repository.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{repository.commits} commits</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${repository.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-semibold">No repository commit distribution found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
