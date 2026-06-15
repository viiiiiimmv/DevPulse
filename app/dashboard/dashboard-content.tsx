/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
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
  Calendar
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
  onLogout 
}: { 
  user: DashboardUser; 
  stats: DashboardStats;
  activities: Activity[];
  commits: DashboardCommit[];
  onLogout: () => Promise<void> 
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [commitPage, setCommitPage] = useState(1);
  const commitsPerPage = 8;
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/github/repos", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync");
      }

      setMessage({
        text: `Successfully synced!`,
        type: "success",
      });
      
      // Refresh the page to load new data from server
      router.refresh();
      
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Failed to sync GitHub data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header section */}
      <div className="bg-card/60 backdrop-blur-lg border border-border/40 rounded-2xl p-6 shadow-sm flex flex-wrap items-center gap-6 justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <img
              src={user.avatarUrl || "https://via.placeholder.com/64"}
              alt="Profile Picture"
              className="relative w-16 h-16 rounded-full border border-border/50 shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Welcome, {user.name || user.username}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button
            onClick={handleSync}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/15 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync GitHub Data</span>
          </button>
          
          <form action={onLogout}>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border font-medium text-sm transition-all ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Repositories", value: stats.totalRepositories, icon: FolderGit, color: "text-indigo-500", href: "/repos" },
          { label: "Total Commits", value: stats.totalCommits, icon: GitCommit, color: "text-violet-500", href: "/analytics" },
          { label: "Stars Earned", value: stats.totalStars, icon: Star, color: "text-amber-500" },
          { label: "Forks Sync", value: stats.totalForks, icon: GitFork, color: "text-pink-500" }
        ].map((item, index) => {
          const Icon = item.icon;
          const cardBody = (
            <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all hover:-translate-y-0.5 group duration-300 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</h3>
                <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-3xl font-extrabold mt-3 text-foreground tracking-tight">{item.value}</p>
            </div>
          );

          if (item.href) {
            return (
              <Link key={index} href={item.href} className="block cursor-pointer">
                {cardBody}
              </Link>
            );
          }

          return <div key={index}>{cardBody}</div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Recent Commits (takes up 2/3 of space on large screens) */}
        <div className="lg:col-span-2 border border-border/40 rounded-2xl bg-card/60 backdrop-blur-md shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-indigo-500" />
              <span>Recent GitHub Commits</span>
            </h2>
            <span className="text-xs bg-secondary/80 font-bold px-2.5 py-1 rounded-full text-muted-foreground animate-pulse">
              Latest Edits
            </span>
          </div>
          
          <div className="divide-y divide-border/25">
            {commits.length === 0 ? (
              <p className="p-10 text-center text-muted-foreground font-semibold text-sm">
                No recent commits found. Click &quot;Sync GitHub Data&quot; to fetch your latest edits!
              </p>
            ) : (
              commits.slice((commitPage - 1) * commitsPerPage, commitPage * commitsPerPage).map((commit) => (
                <div key={commit.id} className="p-5 hover:bg-secondary/25 transition-colors duration-150 flex items-start gap-4 group">
                  {/* Author Avatar */}
                  {commit.authorAvatarUrl ? (
                    <img 
                      src={commit.authorAvatarUrl} 
                      alt={commit.author} 
                      className="w-10 h-10 rounded-full border border-border/40 bg-secondary object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-border/40 bg-secondary flex items-center justify-center text-muted-foreground font-bold text-sm">
                      {commit.author.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Commit Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-150">
                      {commit.message.split('\n')[0]}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs font-semibold text-muted-foreground">
                      <span className="text-foreground/90">{commit.author}</span>
                      <span className="text-muted-foreground/40">&bull;</span>
                      <Link 
                        href={`/repositories/${commit.repositoryId}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>{commit.repository.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-muted-foreground/40">&bull;</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(commit.committedAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Commit SHA */}
                  <div className="hidden sm:block flex-shrink-0">
                    <span className="inline-flex items-center rounded-lg bg-secondary border border-border/30 px-2.5 py-1 text-xs font-bold text-muted-foreground font-mono leading-none">
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Commits Pagination Footer */}
          {commits.length > commitsPerPage && (
            <div className="p-4 border-t border-border/40 flex items-center justify-between bg-secondary/15 font-semibold text-xs transition-colors duration-300">
              <p className="text-muted-foreground">
                Showing <span className="text-foreground">{((commitPage - 1) * commitsPerPage) + 1}</span> to <span className="text-foreground">{Math.min(commitPage * commitsPerPage, commits.length)}</span> of <span className="text-foreground">{commits.length}</span> commits
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCommitPage(p => Math.max(1, p - 1))}
                  disabled={commitPage === 1}
                  className="px-3.5 py-1.5 border border-border/50 bg-card rounded-xl text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 hover:bg-secondary/70 transition-all cursor-pointer flex items-center select-none"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCommitPage(p => Math.min(Math.ceil(commits.length / commitsPerPage), p + 1))}
                  disabled={commitPage >= Math.ceil(commits.length / commitsPerPage)}
                  className="px-3.5 py-1.5 border border-border/50 bg-card rounded-xl text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 hover:bg-secondary/70 transition-all cursor-pointer flex items-center select-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Feed (takes up 1/3 of space on large screens) */}
        <div className="border border-border/40 rounded-2xl bg-card/60 backdrop-blur-md shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-border/40">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-violet-500" />
              <span>Activity Log</span>
            </h2>
          </div>
          <div className="p-5">
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-sm font-semibold py-4">No recent activity synced.</p>
            ) : (
              <div className="relative pl-4 border-l border-border/50 space-y-6 py-2">
                {activities.map(activity => (
                  <div key={activity.id} className="relative group">
                    {/* Activity Bullet Point */}
                    <div className="absolute -left-[22.5px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background scale-100 group-hover:scale-125 transition-transform" />
                    <div>
                      <p className="font-semibold text-sm text-foreground capitalize tracking-wide">
                        {activity.type.replace(/_/g, " ").toLowerCase()}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(activity.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
