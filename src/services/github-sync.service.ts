import { prisma } from "@/src/server/prisma/client";
import { logActivity } from "@/src/services/activity.service";
import {
  getRecentCommits,
  getRepositories,
  getRepositoryLanguages,
} from "@/src/services/github.service";
import { invalidateCache } from "@/src/services/cache.service";
import { emitUserEvent } from "@/src/services/realtime.service";

type SyncOptions = {
  userId: string;
  username?: string | null;
  accessToken: string;
  background?: boolean;
};

export type GitHubSyncResult = {
  syncedRepositories: number;
  fetchedCommits: number;
  syncedLanguages: number;
  skippedRepositories: number;
};

export async function syncGitHubRepositories({
  userId,
  username,
  accessToken,
}: SyncOptions): Promise<GitHubSyncResult> {
  const repos = await getRepositories(accessToken);
  let fetchedCommits = 0;
  let syncedLanguages = 0;
  let skippedRepositories = 0;

  await logActivity(userId, "GITHUB_REPOSITORY_SYNC_STARTED", {
    repositoryCount: repos.length,
  });

  emitUserEvent(userId, {
    type: "GITHUB_REPOSITORY_SYNC_STARTED",
    payload: {
      repositoryCount: repos.length,
    },
  });

  for (const repo of repos) {
    const existingRepo = await prisma.repository.findFirst({
      where: {
        githubRepoId: repo.id.toString(),
        ownerId: userId,
      },
      select: { githubUpdatedAt: true, id: true },
    });

    const repoUpdatedAt = repo.updated_at ? new Date(repo.updated_at) : new Date();
    let shouldFetchCommits = false;

    if (!existingRepo || existingRepo.githubUpdatedAt.getTime() < repoUpdatedAt.getTime()) {
      shouldFetchCommits = true;
    } else if (existingRepo) {
      const commitCount = await prisma.commit.count({
        where: { repositoryId: existingRepo.id },
      });
      if (commitCount < 100) {
        shouldFetchCommits = true;
      }
    }

    const dbRepo = await prisma.repository.upsert({
      where: {
        ownerId_githubRepoId: {
          ownerId: userId,
          githubRepoId: repo.id.toString(),
        },
      },

      update: {
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isPrivate: repo.private,
        githubUpdatedAt: repoUpdatedAt,
        ownerId: userId,
      },

      create: {
        githubRepoId: repo.id.toString(),
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isPrivate: repo.private,
        githubUpdatedAt: repoUpdatedAt,
        ownerId: userId,
      },
    });

    if (shouldFetchCommits) {
      try {
        const owner = repo.owner?.login || username;
        if (owner) {
          const commits = await getRecentCommits(accessToken, owner, repo.name, 100);
          fetchedCommits += commits.length;

          for (const commit of commits) {
            await prisma.commit.upsert({
              where: {
                repositoryId_sha: {
                  repositoryId: dbRepo.id,
                  sha: commit.sha,
                },
              },
              update: {
                message: commit.commit.message,
                author: commit.commit.author?.name || commit.author?.login || "Unknown",
                authorAvatarUrl: commit.author?.avatar_url || null,
                committedAt: commit.commit.author?.date
                  ? new Date(commit.commit.author.date)
                  : new Date(),
              },
              create: {
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author?.name || commit.author?.login || "Unknown",
                authorAvatarUrl: commit.author?.avatar_url || null,
                committedAt: commit.commit.author?.date
                  ? new Date(commit.commit.author.date)
                  : new Date(),
                repositoryId: dbRepo.id,
              },
            });
          }

          const languages = await getRepositoryLanguages(accessToken, owner, repo.name);
          const languageNames = Object.keys(languages);

          if (languageNames.length > 0) {
            await prisma.repositoryLanguage.deleteMany({
              where: {
                repositoryId: dbRepo.id,
                name: {
                  notIn: languageNames,
                },
              },
            });
          }

          for (const [languageName, bytes] of Object.entries(languages)) {
            syncedLanguages += 1;
            await prisma.repositoryLanguage.upsert({
              where: {
                repositoryId_name: {
                  repositoryId: dbRepo.id,
                  name: languageName,
                },
              },
              update: {
                bytes: Number(bytes),
              },
              create: {
                repositoryId: dbRepo.id,
                name: languageName,
                bytes: Number(bytes),
              },
            });
          }
        }
      } catch (error) {
        console.error(`Failed to fetch repository details for ${repo.name}:`, error);
      }
    } else {
      skippedRepositories += 1;
    }

    const totalCommits = await prisma.commit.count({
      where: { repositoryId: dbRepo.id },
    });

    await prisma.stats.upsert({
      where: { repositoryId: dbRepo.id },
      update: {
        totalCommits,
        totalStars: dbRepo.stars,
        totalForks: dbRepo.forks,
      },
      create: {
        repositoryId: dbRepo.id,
        totalCommits,
        totalStars: dbRepo.stars,
        totalForks: dbRepo.forks,
      },
    });
  }

  const result = {
    syncedRepositories: repos.length,
    fetchedCommits,
    syncedLanguages,
    skippedRepositories,
  };

  invalidateCache("github:repos:");

  await logActivity(userId, "GITHUB_REPOSITORIES_SYNCED", result);
  emitUserEvent(userId, {
    type: "GITHUB_REPOSITORIES_SYNCED",
    payload: result,
  });

  return result;
}
