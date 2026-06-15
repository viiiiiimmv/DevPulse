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
  ShieldCheck
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
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [syncData, setSyncData] = useState<GitHubProfileResponse["profile"] | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch("/api/github/repos", {
        method: "GET",
      });

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
      // First, sync the profile
      const profileResponse = await fetch("/api/github/profile", {
        method: "POST",
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.error || "Failed to sync profile");
      }

      setSyncData(profileData.profile);

      // Then, sync the repositories
      const reposResponse = await fetch("/api/github/repos", {
        method: "POST",
      });

      const reposData = await reposResponse.json();

      if (!reposResponse.ok) {
        throw new Error(reposData.error || "Failed to sync repositories");
      }

      // Fetch the newly synced repositories
      await fetchRepositories();

      // Refresh the page data from the server to get the new user.updatedAt
      router.refresh();

      setMessage({
        text: `✓ Successfully synced! Found ${reposData.syncedRepositories} repositories.`,
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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border/45 pb-6">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
            GitHub Profile
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Manage, review, and synchronize your public GitHub data feed.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-xl font-medium text-sm border transition-all ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-4 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Profile Information */}
            <div className="bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-bold text-foreground tracking-tight mb-6">
                Profile Details
              </h2>

              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="relative group self-center sm:self-start">
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full blur opacity-20 group-hover:opacity-35 transition-opacity" />
                  <img
                    src={displayData.avatarUrl || "https://via.placeholder.com/120"}
                    alt={displayData.username}
                    className="relative w-24 h-24 rounded-full border-2 border-border/40 shadow-md object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                    {user.name || displayData.username}
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">
                    @{displayData.username}
                  </p>
                  {displayData.bio && (
                    <p className="text-sm text-muted-foreground max-w-xl font-medium leading-relaxed">
                      {displayData.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-border/30 pt-6 space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-muted-foreground/60" /> Email
                  </span>
                  <span className="text-foreground">
                    {user.email || "Not public"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-muted-foreground/60" /> GitHub ID
                  </span>
                  <span className="font-mono text-foreground">
                    {user.githubId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground/60" /> Member Since
                  </span>
                  <span className="text-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-sm">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Public Repositories
                </div>
                <div className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">
                  {repositories.length}
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-sm">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Last Synced
                </div>
                <div className="text-sm font-mono text-foreground mt-3 leading-relaxed" suppressHydrationWarning>
                  {formatDate(user.updatedAt)}
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-sm">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Stars Received
                </div>
                <div className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">
                  {repositories.reduce((sum, repo) => sum + repo.stars, 0)}
                </div>
              </div>
            </div>


            {/* Sync Details */}
            <div className="bg-card/60 backdrop-blur-md rounded-2xl p-6 border border-border/40 shadow-sm transition-colors duration-300">
              <h3 className="text-base font-bold text-foreground mb-4 tracking-tight">
                Authentication & Integration Profile
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-4 bg-secondary/35 border border-border/30 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      Profile Sync Active
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold leading-relaxed">
                      DevPulse is authorized to keep your repository list and profile stats synced.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-secondary/35 border border-border/30 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      Secure Access Token
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold leading-relaxed">
                      GitHub Auth Token is encrypted at rest and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            
            {/* Sync Button Card */}
            <div className="bg-card/60 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-sm">
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                  syncing
                    ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                    : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? "Syncing..." : "Sync Now"}</span>
              </button>

              <p className="text-[11px] font-semibold text-muted-foreground mt-3 text-center" suppressHydrationWarning>
                Last synced: {formatDate(user.updatedAt)}
              </p>
            </div>

            {/* Quick Stats Panel */}
            <div className="bg-card/60 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-sm">
              <h3 className="font-bold text-foreground text-sm tracking-tight mb-4">
                Overview
              </h3>

              <div className="space-y-3 text-sm font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Synced Repos</span>
                  <span className="text-indigo-500">{repositories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Token State</span>
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-600 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 rounded-2xl p-5">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-500" />
                <span>Sync Tip</span>
              </h4>
              <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                If you recently added repositories or stars on GitHub, hit &quot;Sync Now&quot; to bring them to DevPulse instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
