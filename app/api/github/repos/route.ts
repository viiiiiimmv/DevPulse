import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/server/prisma/client";

import { getRepositories, getRecentCommits } from "@/src/lib/github/github.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const repositories = await prisma.repository.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        githubUpdatedAt: "desc",
      },
      include: {
        stats: true,
      },
    });

    return NextResponse.json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error("Failed to fetch repositories:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch repositories",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const accessToken = session.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 400 }
      );
    }

    const repos = await getRepositories(accessToken);

    for (const repo of repos) {
      const existingRepo = await prisma.repository.findUnique({
        where: { githubRepoId: repo.id.toString() },
        select: { githubUpdatedAt: true, id: true },
      });

      const repoUpdatedAt = repo.updated_at ? new Date(repo.updated_at) : new Date();
      let shouldFetchCommits = false;

      // Only fetch commits if the repository is new, updated, or has no commits yet
      if (!existingRepo || existingRepo.githubUpdatedAt.getTime() < repoUpdatedAt.getTime()) {
        shouldFetchCommits = true;
      } else if (existingRepo) {
        const commitCount = await prisma.commit.count({ where: { repositoryId: existingRepo.id } });
        if (commitCount === 0) {
          shouldFetchCommits = true;
        }
      }

      const dbRepo = await prisma.repository.upsert({
        where: {
          githubRepoId: repo.id.toString(),
        },

        update: {
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPrivate: repo.private,
          githubUpdatedAt: repoUpdatedAt,
        },

        create: {
          githubRepoId: repo.id.toString(),

          name: repo.name,
          description: repo.description,

          stars: repo.stargazers_count,
          forks: repo.forks_count,

          isPrivate: repo.private,

          githubUpdatedAt: repoUpdatedAt,

          ownerId: session.user.id,
        },
      });

      if (shouldFetchCommits) {
        try {
          const owner = repo.owner?.login || session.user.username;
          if (owner) {
            const commits = await getRecentCommits(accessToken, owner, repo.name, 5);
            for (const commit of commits) {
              await prisma.commit.upsert({
                where: { sha: commit.sha },
                update: {
                  message: commit.commit.message,
                  author: commit.commit.author?.name || commit.author?.login || "Unknown",
                  authorAvatarUrl: commit.author?.avatar_url || null,
                  committedAt: commit.commit.author?.date ? new Date(commit.commit.author.date) : new Date(),
                },
                create: {
                  sha: commit.sha,
                  message: commit.commit.message,
                  author: commit.commit.author?.name || commit.author?.login || "Unknown",
                  authorAvatarUrl: commit.author?.avatar_url || null,
                  committedAt: commit.commit.author?.date ? new Date(commit.commit.author.date) : new Date(),
                  repositoryId: dbRepo.id,
                },
              });
            }
          }
        } catch (commitErr) {
          console.error(`Failed to fetch commits for ${repo.name}:`, commitErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      syncedRepositories: repos.length,
    });
  } catch (error) {
    console.error("Repository sync failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sync repositories",
      },
      { status: 500 }
    );
  }
}