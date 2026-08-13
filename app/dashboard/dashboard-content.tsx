/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderGit,
  GitCommit,
  Star,
  GitFork,
  RefreshCw,
  LogOut,
  ExternalLink,
  Activity as ActivityIcon,
  Calendar,
  BriefcaseBusiness,
} from "lucide-react";

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
  onLogout,
}: {
  user: DashboardUser;
  stats: DashboardStats;
  activities: Activity[];
  commits: DashboardCommit[];
  onLogout: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [commitPage, setCommitPage] = useState(1);
  const commitsPerPage = 8;
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
          text: "GitHub sync started. I’ll update the dashboard when it finishes.",
          type: "success",
        });
      }

      if (data.type === "GITHUB_REPOSITORIES_SYNCED") {
        setLoading(false);
        setMessage({
          text: `Sync complete: ${data.payload?.syncedRepositories ?? 0} repositories, ${data.payload?.fetchedCommits ?? 0} commits, ${data.payload?.syncedLanguages ?? 0} language entries.`,
          type: "success",
        });
        router.refresh();
      }

      if (data.type === "GITHUB_SYNC_JOB_FAILED") {
        setLoading(false);
        setMessage({
          text: data.payload?.error ?? "GitHub sync failed",
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
        throw new Error(data.error || "Failed to sync");
      }

      setMessage({
        text: data.queued
          ? "GitHub sync queued. The dashboard will refresh when it completes."
          : "Successfully synced!",
        type: "success",
      });

      if (data.queued) {
        setLoading(false);
      } else {
        router.refresh();
        setLoading(false);
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Failed to sync GitHub data",
        type: "error",
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));

  const lastSynced = activities[0]?.createdAt ? formatDate(activities[0].createdAt) : "No sync yet";

  const metricCards = [
    { label: "Repositories", value: stats.totalRepositories, icon: FolderGit, color: "text-indigo-500", desc: "Tracked projects", href: "/repos" },
    { label: "Total Commits", value: stats.totalCommits, icon: GitCommit, color: "text-violet-500", desc: "Synced commits", href: "/analytics" },
    { label: "Stars Earned", value: stats.totalStars, icon: Star, color: "text-amber-500", desc: "Repository stars" },
    { label: "Forks Sync", value: stats.totalForks, icon: GitFork, color: "text-pink-500", desc: "Forked work" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="dp-card-shell flex flex-wrap items-center justify-between gap-5 bg-card/80 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl || "https://via.placeholder.com/72"}
              alt={user.username}
              className="h-16 w-16 rounded-full border border-border bg-secondary object-cover shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <p className="dp-label">Developer workspace</p>
            <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
              Welcome, {user.name || user.username}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>@{user.username}</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                Last synced {lastSynced}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSync}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/10 transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Synchronizing..." : "Sync GitHub Data"}</span>
          </button>

          <form action={onLogout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/70 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-border hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </header>

      {message && (
        <div
          className={`rounded-md border p-3 text-sm font-medium ${
            message.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metricCards.map((item) => {
          const Icon = item.icon;
          const cardBody = (
            <div className="group flex h-full min-h-[150px] flex-col justify-between rounded-xl border border-border bg-card/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <span className="dp-label">{item.label}</span>
                <Icon className={`h-4 w-4 ${item.color} transition-transform group-hover:scale-110`} />
              </div>

              <div>
                <p className="dp-metric-value mt-3 text-3xl">{item.value}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className="block">
                {cardBody}
              </Link>
            );
          }

          return <div key={item.label}>{cardBody}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <GitCommit className="h-5 w-5 text-indigo-500" />
              Recent GitHub Commits
            </h2>
            <span className="rounded-full border border-border bg-secondary/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Latest edits
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {commits.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No recent commits found. Sync GitHub data to populate your activity feed.
                </p>
              </div>
            ) : (
              commits.slice((commitPage - 1) * commitsPerPage, commitPage * commitsPerPage).map((commit) => (
                <div key={commit.id} className="flex items-start gap-4 p-4 transition-colors duration-150 hover:bg-secondary/35">
                  {commit.authorAvatarUrl ? (
                    <img
                      src={commit.authorAvatarUrl}
                      alt={commit.author}
                      className="h-10 w-10 rounded-full border border-border bg-secondary object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-sm font-bold text-muted-foreground">
                      {commit.author.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                      {commit.message.split("\n")[0]}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-muted-foreground">
                      <span className="text-foreground">{commit.author}</span>
                      <span>•</span>
                      <Link href={`/repositories/${commit.repositoryId}`} className="inline-flex items-center gap-1 text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400">
                        <span>{commit.repository.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(commit.committedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden shrink-0 sm:block">
                    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {commits.length > commitsPerPage && (
            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-secondary/25 p-3 text-xs font-semibold text-muted-foreground">
              <p>
                Showing {((commitPage - 1) * commitsPerPage) + 1} to {Math.min(commitPage * commitsPerPage, commits.length)} of {commits.length} commits
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCommitPage((p) => Math.max(1, p - 1))}
                  disabled={commitPage === 1}
                  className="rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCommitPage((p) => Math.min(Math.ceil(commits.length / commitsPerPage), p + 1))}
                  disabled={commitPage >= Math.ceil(commits.length / commitsPerPage)}
                  className="rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm">
          <div className="border-b border-border/60 p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ActivityIcon className="h-5 w-5 text-violet-500" />
              Activity Log
            </h2>
          </div>

          <div className="p-5">
            {activities.length === 0 ? (
              <div className="rounded-md border border-dashed border-border bg-secondary/30 p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">No recent system activity yet.</p>
              </div>
            ) : (
              <div className="relative space-y-6 border-l border-border/60 pl-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div>
                      <p className="text-sm font-semibold capitalize text-foreground">
                        {activity.type.replace(/_/g, " ").toLowerCase()}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
