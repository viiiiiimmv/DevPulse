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
  AlertCircle
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

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric"
    }).format(new Date(dateString));
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
        <div className="h-20 bg-card/40 border border-border/20 rounded-2xl" />
        <div className="h-12 bg-card/40 border border-border/20 rounded-xl max-w-md" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-40 bg-card/40 border border-border/20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Repositories Unavailable</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{error}</p>
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-border/45 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2 flex items-center gap-2">
            <FolderGit className="w-8 h-8 text-indigo-500" />
            <span>Tracked Repositories</span>
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Synchronize, audit, and analyze tracked code repositories for {user.name} ({user.username}).
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-full border border-border/40 shadow-sm"
            />
          )}
          <span className="text-xs bg-secondary/80 font-bold px-3 py-1 rounded-full text-muted-foreground w-fit h-fit">
            {repos.length} repos total
          </span>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        <input
          type="text"
          placeholder="Search repositories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/40 bg-card/40 focus:bg-card focus:border-primary/50 outline-none text-sm font-semibold text-foreground transition-all duration-200"
        />
      </div>

      {/* Repos Grid */}
      {filteredRepos.length === 0 ? (
        <div className="text-center py-12 border border-border/40 bg-card/25 rounded-2xl">
          <p className="text-sm font-semibold text-muted-foreground">
            {searchQuery ? "No repositories match your search query." : "No repositories synced yet. Try syncing in the Dashboard!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => router.push(`/repositories/${repo.id}`)}
              className="border border-border/45 bg-card/40 rounded-2xl p-5 hover:shadow-md hover:border-primary/20 hover:bg-card/75 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors text-base flex items-center gap-1">
                    {repo.name}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  {repo.isPrivate && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p className="text-muted-foreground text-xs font-semibold line-clamp-2 mb-4 leading-relaxed">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border/20 items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>{repo.stars}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    <GitFork className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{repo.forks}</span>
                  </div>
                </div>

                {repo.languages && repo.languages.length > 0 && (
                  <div className="flex gap-1 flex-wrap max-w-[50%] justify-end">
                    {repo.languages.slice(0, 2).map(lang => (
                      <span key={lang.id} className="px-1.5 py-0.5 rounded bg-secondary/80 text-[9px] font-semibold text-muted-foreground border border-border/20">
                        {lang.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-[10px] font-semibold text-muted-foreground w-full pt-2.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span>Modified {formatDate(repo.githubUpdatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
