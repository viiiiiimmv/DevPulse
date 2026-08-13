/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FolderGit,
  Search,
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  Lock,
  AlertCircle,
} from "lucide-react";

interface Language {
  id: string;
  name: string;
  bytes: number;
}

interface Repository {
  id: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  githubUpdatedAt: string;
  languages?: Language[];
}

interface User {
  id: string;
  name: string;
  email: string | null;
  username: string;
  avatarUrl: string | null;
}

export function ReposClient({ user }: { user: User }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/github/repos");
        if (!response.ok) {
          throw new Error("Failed to load repositories list");
        }
        const data = await response.json();
        if (data.success) {
          setRepos(data.repositories);
        } else {
          throw new Error(data.error || "Unknown response error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load database repositories");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="h-24 rounded-xl border border-border/40 bg-card/40" />
        <div className="h-12 max-w-md rounded-xl border border-border/40 bg-card/40" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 rounded-xl border border-border/40 bg-card/40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-lg font-bold text-foreground">Repositories Unavailable</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="dp-label mb-2">Repository inventory</p>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <FolderGit className="h-8 w-8 text-indigo-500" />
            <span>Tracked Repositories</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Synchronize, audit, and analyze tracked code repositories for {user.name || user.username}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt={user.name || user.username} className="h-10 w-10 rounded-full border border-border bg-secondary object-cover" />
          )}
          <span className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            {repos.length} repos total
          </span>
        </div>
      </header>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search repositories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-card/80 py-2.5 pl-10 pr-3 text-sm font-medium text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {filteredRepos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {searchQuery
              ? "No repositories match your search query."
              : "No repositories synced yet. Try syncing from the Dashboard."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRepos.map((repo) => (
            <button
              key={repo.id}
              type="button"
              onClick={() => router.push(`/repositories/${repo.id}`)}
              className="group flex min-h-[220px] flex-col justify-between rounded-xl border border-border bg-card/80 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-1.5 text-base font-bold text-foreground group-hover:text-primary">
                    <span>{repo.name}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>

                  {repo.isPrivate && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-red-600 dark:text-red-400">
                      <Lock className="h-3 w-3" />
                      Private
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{repo.description}</p>
                )}
              </div>

              <div className="mt-5 space-y-4 border-t border-border/60 pt-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GitFork className="h-3.5 w-3.5 text-indigo-500" />
                    {repo.forks}
                  </span>
                </div>

                {repo.languages && repo.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {repo.languages.slice(0, 3).map((lang) => (
                      <span key={lang.id} className="rounded-md border border-border bg-secondary/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                        {lang.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Last activity {formatDate(repo.githubUpdatedAt)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

