/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Calendar,
  Mail,
  Code,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  UserRound,
  Sparkles,
} from "lucide-react";

interface GitHubProfileResponse {
  success: boolean;
  profile: {
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    publicRepos: number;
  };
}

interface Repository {
  id: string;
  githubRepoId: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  githubUpdatedAt: string;
  createdAt: string;
}

interface RepositoriesResponse {
  success: boolean;
  repositories: Repository[];
}

interface User {
  id: string;
  name: string;
  email: string | null;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  githubId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function GitHubProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [syncData, setSyncData] = useState<GitHubProfileResponse["profile"] | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch("/api/github/repos", { method: "GET" });
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch repositories:", data.error || "Unknown error");
        return;
      }

      const reposData = data as RepositoriesResponse;
      setRepositories(reposData.repositories);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRepositories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const profileResponse = await fetch("/api/github/profile", { method: "POST" });
      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.error || "Failed to sync profile");
      }

      setSyncData(profileData.profile);

      const reposResponse = await fetch("/api/github/repos", { method: "POST" });
      const reposData = await reposResponse.json();

      if (!reposResponse.ok) {
        throw new Error(reposData.error || "Failed to sync repositories");
      }

      await fetchRepositories();
      router.refresh();

      setMessage({
        text: `Successfully synced! Found ${reposData.syncedRepositories} repositories.`,
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: `✗ ${error instanceof Error ? error.message : "Failed to sync GitHub profile"}`,
        type: "error",
      });
    } finally {
      setSyncing(false);
    }
  };

  const displayData = syncData || {
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    publicRepos: 0,
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="border-b border-border/60 pb-6">
        <p className="dp-label mb-2">Account connection</p>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <UserRound className="h-8 w-8 text-indigo-500" />
          GitHub Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your connected GitHub identity and synchronization status.</p>
      </header>

      {message && (
        <div className={`rounded-md border p-3 text-sm font-medium ${message.type === "success" ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400" : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"}`}>
          {message.text}
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_0.75fr]">
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img src={displayData.avatarUrl || "https://via.placeholder.com/120"} alt={displayData.username} className="h-24 w-24 rounded-full border border-border object-cover shadow-sm" />

              <div className="space-y-2">
                <p className="dp-label">GitHub Identity</p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{user.name || displayData.username}</h2>
                <p className="text-muted-foreground">@{displayData.username}</p>
                {displayData.bio && <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{displayData.bio}</p>}
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-border/60 pt-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />Email</span>
                <span className="text-foreground">{user.email || "Not public"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Code className="h-4 w-4" />GitHub ID</span>
                <span className="font-mono text-foreground">{user.githubId}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />Member since</span>
                <span className="text-foreground">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Public repos</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{repositories.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Last synced</p>
              <p className="mt-2 text-sm font-medium text-foreground" suppressHydrationWarning>{formatDate(user.updatedAt)}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Stars received</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{repositories.reduce((sum, repo) => sum + repo.stars, 0)}</p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-foreground">GitHub connection</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Profile synchronization active</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">DevPulse is authorized to keep the GitHub profile and repository list aligned with your connected account.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-500" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Secure access</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Authentication credentials are handled through GitHub OAuth and stored securely without exposing token values in the UI.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-all ${syncing ? "cursor-not-allowed border border-border bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground hover:-translate-y-0.5"}`}
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
            <p className="mt-3 text-center text-[11px] font-semibold text-muted-foreground" suppressHydrationWarning>
              Last synced: {formatDate(user.updatedAt)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground">Overview</h3>
            <div className="mt-4 space-y-3 text-sm font-medium">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Synced repositories</span>
                <span className="font-bold text-indigo-500">{repositories.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Connection status</span>
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-green-600 dark:text-green-400">Connected</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              Sync tip
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Re-synchronizing keeps your latest repositories, stars, and activity data aligned with GitHub.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
