/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [loadingRepos, setLoadingRepos] = useState(false);

  const fetchRepositories = async () => {
    setLoadingRepos(true);
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
    } finally {
      setLoadingRepos(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchRepositories();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            GitHub Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage and sync your GitHub profile data and repositories
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg font-medium transition-all ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-300 dark:border-green-700"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Profile Information
              </h2>

              <div className="flex gap-6 mb-6">
                <img
                  src={displayData.avatarUrl || "https://via.placeholder.com/120"}
                  alt={displayData.username}
                  className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 shadow-md"
                />

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-3">
                    @{displayData.username}
                  </p>
                  {displayData.bio && (
                    <p className="text-slate-600 dark:text-slate-300 max-w-md">
                      {displayData.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Email:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {user.email || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">GitHub ID:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {user.githubId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Member Since:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                  Public Repositories
                </div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                  {repositories.length}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                  Last Synced
                </div>
                <div className="text-sm font-mono text-purple-900 dark:text-purple-100 mt-2" suppressHydrationWarning>
                  {formatDate(user.updatedAt)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="text-sm text-green-600 dark:text-green-300 font-medium">
                  Total Stars
                </div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                  {repositories.reduce((sum, repo) => sum + repo.stars, 0)}
                </div>
              </div>
            </div>

            {/* Repositories Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Your Repositories
              </h2>

              {loadingRepos ? (
                <div className="flex justify-center items-center py-8">
                  <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : repositories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    No repositories found. Click &quot;Sync Now&quot; to fetch your repositories.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          {repo.name}
                        </h3>
                        {repo.isPrivate && (
                          <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded">
                            Private
                          </span>
                        )}
                      </div>

                      {repo.description && (
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {repo.stars}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {repo.forks}
                        </div>

                        <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                          Updated {formatDate(repo.githubUpdatedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sync Details */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Sync Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Profile & Repositories Synced
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Both your profile information and repositories are synced with GitHub.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Secure Authentication
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Your GitHub token is securely stored and only used to fetch authorized data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sync Button */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700 sticky top-6">
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform ${
                  syncing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
                }`}
              >
                {syncing ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Syncing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sync Now
                  </div>
                )}
              </button>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 text-center" suppressHydrationWarning>
                Last synced: {formatDate(user.updatedAt)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Quick Stats
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Synced Repos
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {repositories.length}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Sync Status
                    </span>
                    <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                Sync your profile regularly to keep your repositories, stars, and forks
                up to date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
