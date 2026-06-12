/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";

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
  activityCount: number;
  weeklyCommitCount: number;
}

export interface Activity {
  id: string;
  type: string;
  createdAt: string;
}

export interface Repository {
  id: string;
  name: string;
  stars: number;
  forks: number;
  githubUpdatedAt: string;
}

export function DashboardContent({ user, onLogout }: { user: DashboardUser; onLogout: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setDataLoading(true);
      try {
        const [statsRes, activityRes, reposRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activity"),
          fetch("/api/dashboard/repos")
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData.activities);
        }
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData.repositories);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setDataLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/github/profile", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync");
      }

      setMessage({
        text: `Successfully synced! Updated with ${data.profile.publicRepos} public repositories.`,
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Failed to sync GitHub data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl || ""}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full border shadow-sm"
          />

          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Welcome {user.name}
            </h1>
            <p className="text-gray-500 dark:text-slate-400">
              @{user.username}
            </p>
          </div>
          
          <div className="ml-auto flex gap-4">
            <a
              href="/github/profile"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              GitHub Profile
            </a>
            <form action={onLogout}>
              <button
                type="submit"
                className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors dark:text-white"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {dataLoading ? (
          <div className="mt-8 flex justify-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 dark:bg-blue-900/30 dark:border-blue-800">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Repositories</h3>
                  <p className="text-3xl font-bold text-blue-900 mt-1 dark:text-blue-100">{stats.totalRepositories}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-4 dark:bg-green-900/30 dark:border-green-800">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Total Commits</h3>
                  <p className="text-3xl font-bold text-green-900 mt-1 dark:text-green-100">{stats.totalCommits}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 dark:bg-yellow-900/30 dark:border-yellow-800">
                  <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Total Stars</h3>
                  <p className="text-3xl font-bold text-yellow-900 mt-1 dark:text-yellow-100">{stats.totalStars}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-4 dark:bg-purple-900/30 dark:border-purple-800">
                  <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300">Total Forks</h3>
                  <p className="text-3xl font-bold text-purple-900 mt-1 dark:text-purple-100">{stats.totalForks}</p>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded p-4 dark:bg-pink-900/30 dark:border-pink-800">
                  <h3 className="text-sm font-semibold text-pink-800 dark:text-pink-300">Weekly Commits</h3>
                  <p className="text-3xl font-bold text-pink-900 mt-1 dark:text-pink-100">{stats.weeklyCommitCount}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded p-4 dark:bg-indigo-900/30 dark:border-indigo-800">
                  <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Activity Count</h3>
                  <p className="text-3xl font-bold text-indigo-900 mt-1 dark:text-indigo-100">{stats.activityCount}</p>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity Feed */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Activity Feed</h2>
                {activities.length === 0 ? (
                  <p className="text-gray-500">No recent activity.</p>
                ) : (
                  <ul className="space-y-4">
                    {activities.map(activity => (
                      <li key={activity.id} className="flex gap-3 text-sm">
                        <div className="mt-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
                          <svg className="w-4 h-4 text-slate-500 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                        </div>
                        <div>
                          <p className="font-medium dark:text-slate-200">{activity.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{formatDate(activity.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Recent Repositories */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Recently Updated Repos</h2>
                {repos.length === 0 ? (
                  <p className="text-gray-500">No repositories synced yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {repos.map(repo => (
                      <li key={repo.id} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-base">{repo.name}</h3>
                          <span className="text-xs text-slate-500">{formatDate(repo.githubUpdatedAt)}</span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">⭐ {repo.stars}</span>
                          <span className="flex items-center gap-1">🔄 {repo.forks}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
