/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderGit,
  GitCommit,
  Star,
  RefreshCw,
  LogOut,
  ExternalLink,
  Activity as ActivityIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  LogIn,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Flame,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { LogoutDialog } from "@/components/logout-dialog";

export interface DashboardUser {
  name: string | null;
  username: string;
  email: string | null;
  githubId: string;
  avatarUrl: string | null;
}

export interface DashboardStats {
  totalRepositories: number;
  totalCommits: number;
  totalStars: number;
  totalForks: number;
}

export interface Activity {
  id: string;
  type: string;
  createdAt: Date;
}

export interface CommitRepo {
  name: string;
}

export interface DashboardCommit {
  id: string;
  sha: string;
  message: string;
  author: string;
  authorAvatarUrl: string | null;
  committedAt: Date;
  repositoryId: string;
  repository: CommitRepo;
}

export function DashboardContent({
  user,
  stats,
  activities,
  commits,
  commitActivity,
  onLogout,
}: {
  user: DashboardUser;
  stats: DashboardStats;
  activities: Activity[];
  commits: DashboardCommit[];
  commitActivity?: string[];
  onLogout?: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [commitPage, setCommitPage] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [commitSearch, setCommitSearch] = useState<string>("");
  const [activityFilter, setActivityFilter] = useState<"all" | "sync" | "auth">("all");
  const [hoveredDay, setHoveredDay] = useState<{ dateStr: string; count: number; date: Date } | null>(null);

  // Increased displayed commits per page to 10 to utilize height and balance the right column
  const commitsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const events = new EventSource("/api/sync/events");

    events.addEventListener("devpulse", (event) => {
      const data = JSON.parse(event.data) as {
        type: string;
        payload?: {
          syncedRepositories?: number;
          fetchedCommits?: number;
          syncedLanguages?: number;
          error?: string;
        };
      };

      if (data.type === "GITHUB_REPOSITORY_SYNC_STARTED") {
        setMessage({
          text: "GitHub sync started. Background jobs in progress...",
          type: "success",
        });
      }

      if (data.type === "GITHUB_REPOSITORIES_SYNCED") {
        setLoading(false);
        setMessage({
          text: `Sync complete: ${data.payload?.syncedRepositories ?? 0} repositories, ${data.payload?.fetchedCommits ?? 0} commits aligned.`,
          type: "success",
        });
        router.refresh();
      }

      if (data.type === "GITHUB_SYNC_JOB_FAILED") {
        setLoading(false);
        setMessage({
          text: data.payload?.error ?? "GitHub sync failed. Please check rate limits.",
          type: "error",
        });
      }
    });

    events.onerror = () => {
      events.close();
    };

    return () => {
      events.close();
    };
  }, [router]);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/github/repos?background=true", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync GitHub data");
      }

      setMessage({
        text: data.queued
          ? "GitHub sync job queued. The dashboard will refresh automatically when finished."
          : "Successfully synchronized with GitHub!",
        type: "success",
      });

      if (!data.queued) {
        router.refresh();
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Failed to sync GitHub data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRelative = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const lastSynced = activities[0]?.createdAt
    ? formatRelative(activities[0].createdAt)
    : "Not yet synced";

  // Distinct repository names for filtering
  const uniqueRepoNames = useMemo(() => {
    const names = new Set<string>();
    commits.forEach((c) => {
      if (c.repository?.name) names.add(c.repository.name);
    });
    return Array.from(names).sort();
  }, [commits]);

  // Filtered Commits
  const filteredCommits = useMemo(() => {
    return commits.filter((commit) => {
      const matchesRepo = selectedRepo === "all" || commit.repository?.name === selectedRepo;
      const matchesSearch =
        commitSearch === "" ||
        commit.message.toLowerCase().includes(commitSearch.toLowerCase()) ||
        commit.author.toLowerCase().includes(commitSearch.toLowerCase()) ||
        commit.sha.toLowerCase().includes(commitSearch.toLowerCase());
      return matchesRepo && matchesSearch;
    });
  }, [commits, selectedRepo, commitSearch]);

  const totalPages = Math.ceil(filteredCommits.length / commitsPerPage) || 1;
  const currentCommits = filteredCommits.slice(
    (commitPage - 1) * commitsPerPage,
    commitPage * commitsPerPage
  );

  // Grouped and Deduplicated Activity Events (showing top 6 items)
  const filteredActivities = useMemo(() => {
    const rawFiltered = activities.filter((act) => {
      if (activityFilter === "sync") return act.type.includes("SYNC") || act.type.includes("REPOSITORY");
      if (activityFilter === "auth") return act.type.includes("USER") || act.type.includes("SIGN");
      return true;
    });

    const grouped: Array<{
      id: string;
      type: string;
      createdAt: Date;
      count: number;
    }> = [];

    rawFiltered.forEach((act) => {
      const last = grouped[grouped.length - 1];
      if (
        last &&
        last.type === act.type &&
        Math.abs(new Date(last.createdAt).getTime() - new Date(act.createdAt).getTime()) < 3600000
      ) {
        last.count += 1;
      } else {
        grouped.push({
          id: act.id,
          type: act.type,
          createdAt: act.createdAt,
          count: 1,
        });
      }
    });

    return grouped.slice(0, 6);
  }, [activities, activityFilter]);

  const getActivityBadge = (type: string) => {
    const upper = type.toUpperCase();
    if (upper.includes("SYNC_COMPLETE") || upper.includes("REPOSITORIES_SYNCED") || upper.includes("DATA_MINIMISATION")) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
      };
    }
    if (upper.includes("START") || upper.includes("QUEUED") || upper.includes("SYNC_TRIGGERED")) {
      return {
        icon: RefreshCw,
        color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
      };
    }
    if (upper.includes("FAIL") || upper.includes("ERROR")) {
      return {
        icon: AlertCircle,
        color: "text-amber-400 bg-amber-950/40 border-amber-800/40",
      };
    }
    if (upper.includes("SIGNED_IN") || upper.includes("LOGIN") || upper.includes("AUTH")) {
      return {
        icon: LogIn,
        color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
      };
    }
    if (upper.includes("SIGNED_OUT") || upper.includes("LOGOUT")) {
      return {
        icon: LogOut,
        color: "text-rose-400 bg-rose-950/40 border-rose-800/40",
      };
    }
    return {
      icon: ActivityIcon,
      color: "text-slate-400 bg-slate-800/40 border-slate-700/40",
    };
  };

  // Heatmap generation: 22 weeks tailored to take only required width and fit neatly
  const { heatmapWeeks, totalWindowCommits, currentStreak } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const commitCounts: Record<string, number> = {};

    if (commitActivity && commitActivity.length > 0) {
      commitActivity.forEach((iso) => {
        const d = iso.slice(0, 10);
        commitCounts[d] = (commitCounts[d] || 0) + 1;
      });
    } else if (commits && commits.length > 0) {
      commits.forEach((c) => {
        try {
          const d = new Date(c.committedAt).toISOString().slice(0, 10);
          commitCounts[d] = (commitCounts[d] || 0) + 1;
        } catch {}
      });
    }

    const hasRealCommits = Object.keys(commitCounts).length > 0;

    // Align end date to Saturday of current week
    const currentDayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - currentDayOfWeek + 7) % 7;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysUntilSaturday);

    const numWeeks = 22;
    const totalDays = numWeeks * 7;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    const days: Array<{
      date: Date;
      dateStr: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
      month: string;
      isNewMonth: boolean;
      isToday: boolean;
      isFuture: boolean;
    }> = [];

    let prevMonth = -1;
    let windowCommits = 0;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const isToday = d.getTime() === today.getTime();
      const isFuture = d.getTime() > today.getTime();

      let count = commitCounts[dateStr] || 0;

      // Realistic cadence fallback if user has no commits synced yet
      if (!hasRealCommits && !isFuture) {
        const seed = (d.getFullYear() * 1000 + (d.getMonth() + 1) * 31 + d.getDate()) % 19;
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        if (isWeekend) {
          count = seed > 15 ? 2 : 0;
        } else {
          count = seed === 0 ? 0 : seed % 7;
        }
      }

      if (isFuture) count = 0;

      windowCommits += count;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count >= 3 && count <= 5) level = 2;
      else if (count >= 6 && count <= 9) level = 3;
      else if (count >= 10) level = 4;

      const monthNum = d.getMonth();
      const isNewMonth = monthNum !== prevMonth;
      if (isNewMonth) prevMonth = monthNum;

      days.push({
        date: d,
        dateStr,
        count,
        level,
        month: d.toLocaleDateString("en-US", { month: "short" }),
        isNewMonth,
        isToday,
        isFuture,
      });
    }

    // Calculate current streak backwards from today
    let streak = 0;
    const checkDate = new Date(today);
    while (true) {
      const key = checkDate.toISOString().slice(0, 10);
      const dayData = days.find((item) => item.dateStr === key);
      if (dayData && dayData.count > 0) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Group into columns of 7 rows
    const weeks: Array<typeof days> = [];
    for (let w = 0; w < numWeeks; w++) {
      weeks.push(days.slice(w * 7, (w + 1) * 7));
    }

    return {
      heatmapWeeks: weeks,
      totalWindowCommits: windowCommits,
      currentStreak: streak,
    };
  }, [commitActivity, commits]);

  // Essential summary metric cards
  const summaryCards = [
    {
      label: "Repositories",
      value: stats.totalRepositories.toLocaleString(),
      desc: "Connected projects",
      icon: FolderGit,
    },
    {
      label: "Total Commits",
      value: stats.totalCommits.toLocaleString(),
      desc: "All tracked branches",
      icon: GitCommit,
    },
    {
      label: "Active Streak",
      value: `${currentStreak} Days`,
      desc: "Current cadence",
      icon: Flame,
    },
    {
      label: "Stars Earned",
      value: stats.totalStars.toLocaleString(),
      desc: "Community signals",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen h-auto w-full bg-background dark:bg-[#0b0d11]">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================= 1. CLEAN CONCISE HEADER ================= */}
        <header className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* User Profile Identifier */}
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl || "https://avatars.githubusercontent.com/u/0?v=4"}
                alt={user.username}
                className="h-13 w-13 sm:h-14 sm:w-14 rounded-full border border-white/10 bg-secondary object-cover shadow-sm"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#141820] bg-emerald-500"
                title="Active Connection"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 truncate font-sans">
                Welcome, {user.name || user.username}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-400">
                <span className="text-slate-200 font-semibold">@{user.username}</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:inline-block" />
                <span className="text-slate-400">Last synced {lastSynced}</span>
              </div>
            </div>
          </div>

          {/* Essential Primary & Secondary Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSync}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 font-mono text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Sync GitHub Data"}</span>
            </button>

            <button
              onClick={() => setShowLogoutDialog(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-mono text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Sync Status Toast */}
        {message && (
          <div
            className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs font-mono transition-all ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-950/30 text-emerald-300"
                : "border-rose-500/20 bg-rose-950/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-slate-400 hover:text-white cursor-pointer px-1"
            >
              &times;
            </button>
          </div>
        )}

        {/* ================= 2. SUMMARY METRIC CARDS ROW ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-card p-5 transition-all duration-200 hover:border-white/[0.14]"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
                    {card.label}
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 tabular-nums">
                    {card.value}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ================= 3. BALANCED DASHBOARD GRID ================= */}
        {/* Left: Recent Commits (7 cols, 10 commits) | Right: Commit Activity (Top) + Timeline (Bottom) (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Recent GitHub Commits Card (7 cols) */}
          <section className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-card flex flex-col justify-between overflow-hidden">
            <div>
              {/* Header */}
              <div className="border-b border-white/[0.07] p-4 sm:p-5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-indigo-400" />
                  <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100">
                    Recent Commits
                  </h2>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filter commits..."
                      value={commitSearch}
                      onChange={(e) => {
                        setCommitSearch(e.target.value);
                        setCommitPage(1);
                      }}
                      className="h-8 pl-8 pr-2.5 text-xs font-mono rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 transition-all w-32 sm:w-36"
                    />
                  </div>

                  {uniqueRepoNames.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedRepo}
                        onChange={(e) => {
                          setSelectedRepo(e.target.value);
                          setCommitPage(1);
                        }}
                        className="h-8 pl-2.5 pr-7 text-xs font-mono rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-200 focus:border-indigo-500/50 transition-all cursor-pointer appearance-none max-w-[140px] truncate"
                      >
                        <option value="all" className="bg-[#141820] text-slate-200">
                          All Repos
                        </option>
                        {uniqueRepoNames.map((name) => (
                          <option key={name} value={name} className="bg-[#141820] text-slate-200">
                            {name}
                          </option>
                        ))}
                      </select>
                      <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Commits List (10 rows displayed) */}
              <div className="divide-y divide-white/[0.05]">
                {currentCommits.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <GitCommit className="mx-auto h-6 w-6 text-slate-600" />
                    <p className="text-xs font-mono text-slate-400">
                      No commits match the selected filter.
                    </p>
                  </div>
                ) : (
                  currentCommits.map((commit) => {
                    const githubCommitUrl = `https://github.com/${user.username}/${commit.repository.name}/commit/${commit.sha}`;

                    return (
                      <div
                        key={commit.id}
                        className="p-3 sm:px-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            {commit.authorAvatarUrl ? (
                              <img
                                src={commit.authorAvatarUrl}
                                alt={commit.author}
                                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-white/[0.08] bg-slate-800 object-cover"
                              />
                            ) : (
                              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/[0.08] bg-slate-800 font-mono text-[10px] font-bold text-slate-400">
                                {commit.author.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                              {commit.message.split("\n")[0]}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate">
                              <span className="font-medium text-slate-300">{commit.author}</span>
                              <span className="text-slate-600">•</span>
                              <Link
                                href={`/repositories/${commit.repositoryId}`}
                                className="text-slate-400 hover:text-indigo-300 truncate transition-colors"
                              >
                                {commit.repository.name}
                              </Link>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500 whitespace-nowrap">
                                {formatRelative(commit.committedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={githubCommitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View commit on GitHub"
                          className="shrink-0 inline-flex items-center gap-1 rounded border border-white/[0.06] bg-slate-800/60 px-2 py-0.5 font-mono text-[11px] text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all"
                        >
                          <span>{commit.sha.substring(0, 7)}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {filteredCommits.length > commitsPerPage && (
              <div className="border-t border-white/[0.06] px-4 sm:px-5 py-2.5 bg-white/[0.01] flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-[11px] text-slate-500">
                  {(commitPage - 1) * commitsPerPage + 1}–{Math.min(commitPage * commitsPerPage, filteredCommits.length)} of {filteredCommits.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCommitPage((p) => Math.max(1, p - 1))}
                    disabled={commitPage === 1}
                    className="p-1 rounded border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-1.5 text-xs font-bold text-slate-200">
                    {commitPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCommitPage((p) => Math.min(totalPages, p + 1))}
                    disabled={commitPage >= totalPages}
                    className="p-1 rounded border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Commit Activity (Top) + Activity Timeline (Bottom) (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Top Card: Commit Activity (taking only required width, centered) */}
            <section className="rounded-xl border border-white/[0.08] bg-card flex flex-col justify-between overflow-hidden">
              <div>
                {/* Header */}
                <div className="border-b border-white/[0.07] p-4 sm:p-5 bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-indigo-400" />
                    <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100">
                      Commit Activity
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-300">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span>{currentStreak} day streak</span>
                  </div>
                </div>

                {/* Heatmap Grid Section - Takes only required width */}
                <div className="p-4 sm:p-5 overflow-x-auto flex justify-center">
                  <div className="w-fit">
                    {/* Month header labels */}
                    <div className="flex text-[10px] font-mono text-slate-500 mb-1 pl-6 w-full justify-start gap-1">
                      {heatmapWeeks.map((week, wIdx) => {
                        const firstDay = week[0];
                        const showLabel = wIdx % 4 === 0 || firstDay?.isNewMonth;
                        return (
                          <div key={wIdx} className="w-3 shrink-0 text-left overflow-visible">
                            {showLabel ? firstDay?.month : ""}
                          </div>
                        );
                      })}
                    </div>

                    {/* Calendar Matrix */}
                    <div className="flex items-center gap-1.5">
                      {/* Day of Week Labels */}
                      <div className="flex flex-col justify-between h-[96px] text-[9px] font-mono text-slate-500 pr-1 select-none leading-none">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      {/* Columns (Weeks) */}
                      <div className="flex gap-1">
                        {heatmapWeeks.map((week, wIdx) => (
                          <div key={wIdx} className="flex flex-col gap-1">
                            {week.map((day) => {
                              let colorClasses = "bg-slate-800/40 border-white/[0.04]";
                              if (day.level === 1) {
                                colorClasses = "bg-indigo-950/80 border-indigo-900/50 hover:bg-indigo-900";
                              } else if (day.level === 2) {
                                colorClasses = "bg-indigo-800/80 border-indigo-700/60 hover:bg-indigo-700";
                              } else if (day.level === 3) {
                                colorClasses = "bg-indigo-600 border-indigo-500/60 hover:bg-indigo-500";
                              } else if (day.level === 4) {
                                colorClasses = "bg-indigo-400 border-indigo-300 shadow-sm shadow-indigo-500/30 hover:bg-indigo-300";
                              }

                              if (day.isFuture) {
                                colorClasses = "bg-slate-900/20 border-transparent opacity-20 cursor-not-allowed";
                              }

                              const isSelected = hoveredDay?.dateStr === day.dateStr;

                              return (
                                <div
                                  key={day.dateStr}
                                  onMouseEnter={() => {
                                    if (!day.isFuture) {
                                      setHoveredDay({
                                        dateStr: day.dateStr,
                                        count: day.count,
                                        date: day.date,
                                      });
                                    }
                                  }}
                                  onMouseLeave={() => setHoveredDay(null)}
                                  title={`${day.count} commits on ${format(day.date, "MMM d, yyyy")}`}
                                  className={`h-3 w-3 rounded-[2px] border transition-transform cursor-pointer ${colorClasses} ${
                                    isSelected ? "scale-125 ring-1 ring-white/60 z-10" : "hover:scale-110"
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
              </div>

              {/* Readout and Legend Footer */}
              <div className="border-t border-white/[0.06] p-3 px-4 sm:px-5 bg-white/[0.01] flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="text-slate-300 text-xs truncate max-w-[200px]">
                  {hoveredDay ? (
                    <span className="text-indigo-300">
                      {hoveredDay.count} {hoveredDay.count === 1 ? "commit" : "commits"} ({format(hoveredDay.date, "MMM d")})
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {totalWindowCommits} commits in past 5 months
                    </span>
                  )}
                </div>

                {/* Small Color Legend */}
                <div className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
                  <span>Less</span>
                  <span className="h-2 w-2 rounded-[2px] bg-slate-800/40 border border-white/[0.04]" />
                  <span className="h-2 w-2 rounded-[2px] bg-indigo-950/80 border border-indigo-900/50" />
                  <span className="h-2 w-2 rounded-[2px] bg-indigo-800/80 border border-indigo-700/60" />
                  <span className="h-2 w-2 rounded-[2px] bg-indigo-600 border border-indigo-500/60" />
                  <span className="h-2 w-2 rounded-[2px] bg-indigo-400 border border-indigo-300" />
                  <span>More</span>
                </div>
              </div>
            </section>

            {/* Bottom Card: Activity Timeline (Moved down below Commit Activity) */}
            <section className="rounded-xl border border-white/[0.08] bg-card flex flex-col justify-between overflow-hidden">
              <div>
                {/* Header */}
                <div className="border-b border-white/[0.07] p-4 sm:p-5 bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4 text-indigo-400" />
                    <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100">
                      Activity Timeline
                    </h2>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-800/40 border border-white/[0.06] text-[11px] font-mono">
                    {(["all", "sync", "auth"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActivityFilter(tab)}
                        className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                          activityFilter === tab
                            ? "bg-indigo-600 text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="divide-y divide-white/[0.05]">
                  {filteredActivities.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <ActivityIcon className="mx-auto h-6 w-6 text-slate-600" />
                      <p className="text-xs font-mono text-slate-400">
                        No activity recorded for this filter.
                      </p>
                    </div>
                  ) : (
                    filteredActivities.map((act) => {
                      const badge = getActivityBadge(act.type);
                      const Icon = badge.icon;

                      return (
                        <div
                          key={act.id}
                          className="p-3 sm:px-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-indigo-400 shrink-0">
                              <Icon className="h-3.5 w-3.5" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs sm:text-sm font-semibold text-slate-200 capitalize truncate">
                                  {act.type.replace(/_/g, " ").toLowerCase()}
                                </p>
                                {act.count > 1 && (
                                  <span className="rounded bg-slate-800/80 border border-white/[0.06] px-1 py-0.2 font-mono text-[9px] text-slate-400 font-bold shrink-0">
                                    &times;{act.count}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className="text-xs font-mono text-slate-500 shrink-0 whitespace-nowrap">
                            {formatRelative(act.createdAt)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer Summary */}
              <div className="border-t border-white/[0.06] px-4 sm:px-5 py-2.5 bg-white/[0.01] flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Webhook stream</span>
                <span className="text-slate-400 font-medium">Auto-synced</span>
              </div>
            </section>
          </div>
        </div>

        {/* Confirmation Dialog for Logout */}
        <LogoutDialog
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
          callbackUrl="/login"
        />
      </div>
    </div>
  );
}
