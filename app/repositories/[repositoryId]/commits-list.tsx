/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Commit {
  id: string;
  sha: string;
  message: string;
  author: string;
  authorAvatarUrl: string | null;
  committedAt: string;
}

interface CommitsResponse {
  commits: Commit[];
  pagination: Pagination;
}

export function CommitsList({ repositoryId }: { repositoryId: string }) {
  const [data, setData] = useState<CommitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchCommits() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/repositories/${repositoryId}/commits?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch commits");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, [repositoryId, page]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(new Date(dateString));
  };

  if (loading && !data) {
    return (
      <div className="p-16 flex justify-center items-center">
        <RefreshCw className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm font-semibold text-red-600 dark:text-red-400">
        Failed to load commits: {error}
      </div>
    );
  }

  if (!data || data.commits.length === 0) {
    return (
      <div className="p-10 text-center text-sm font-semibold text-muted-foreground">
        No commits found for this repository.
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <ul className="divide-y divide-border/20">
        {data.commits.map((commit) => (
          <li key={commit.id} className="p-5 hover:bg-secondary/25 transition-colors duration-150">
            <div className="flex items-start gap-4">
              
              {/* Author Avatar */}
              {commit.authorAvatarUrl ? (
                <img 
                  src={commit.authorAvatarUrl} 
                  alt={commit.author} 
                  className="w-10 h-10 rounded-full border border-border/40 shadow-sm bg-secondary object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-border/40 bg-secondary flex items-center justify-center text-muted-foreground font-bold text-sm">
                  {commit.author.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Commit Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate leading-snug">
                  {commit.message.split('\n')[0]}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold text-muted-foreground">
                  <span className="text-foreground/90">{commit.author}</span>
                  <span className="text-muted-foreground/50">&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span>{formatDate(commit.committedAt)}</span>
                  </span>
                </div>
              </div>
              
              {/* SHA hash */}
              <div className="hidden sm:block">
                <span className="inline-flex items-center rounded-lg bg-secondary border border-border/30 px-2.5 py-1 text-xs font-bold text-muted-foreground font-mono leading-none">
                  {commit.sha.substring(0, 7)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {data.pagination.totalPages > 1 && (
        <div className="p-4 border-t border-border/40 flex items-center justify-between bg-secondary/20 font-semibold text-xs">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground">{((page - 1) * limit) + 1}</span> to <span className="text-foreground">{Math.min(page * limit, data.pagination.total)}</span> of <span className="text-foreground">{data.pagination.total}</span> commits
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!data.pagination.hasPrevPage || loading}
              className="px-3.5 py-2 border border-border/50 bg-card rounded-xl text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 hover:bg-secondary/70 transition-all cursor-pointer flex items-center"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={!data.pagination.hasNextPage || loading}
              className="px-3.5 py-2 border border-border/50 bg-card rounded-xl text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 hover:bg-secondary/70 transition-all cursor-pointer flex items-center"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
