import { prisma } from "@/src/server/prisma/client";

export async function getDashboardStats(userId: string) {
  const [
    totalRepositories,
    totalCommits,
    reposWithStats
  ] = await Promise.all([
    prisma.repository.count({ where: { ownerId: userId } }),
    prisma.commit.count({ where: { repository: { ownerId: userId } } }),
    prisma.repository.findMany({
      where: { ownerId: userId },
      select: { stars: true, forks: true }
    })
  ]);

  const totalStars = reposWithStats.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = reposWithStats.reduce((sum, repo) => sum + repo.forks, 0);

  return {
    totalRepositories,
    totalCommits,
    totalStars,
    totalForks,
  };
}

export async function getRecentActivity(userId: string, limit: number = 10) {
  return await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getDashboardRepositories(userId: string, limit: number = 10) {
  return await prisma.repository.findMany({
    where: { ownerId: userId },
    orderBy: { githubUpdatedAt: "desc" },
    take: limit,
    include: {
      languages: true,
    },
  });
}

export async function getDashboardCommits(userId: string, limit: number = 10) {
  return await prisma.commit.findMany({
    where: {
      repository: {
        ownerId: userId,
      },
    },
    orderBy: { committedAt: "desc" },
    take: limit,
    include: {
      repository: {
        select: {
          name: true,
        },
      },
    },
  });
}

export interface DashboardLanguageStat {
  name: string;
  bytes: number;
  repoCount: number;
  percentage: number;
}

export interface DashboardLanguageBreakdown {
  totalBytes: number;
  languages: DashboardLanguageStat[];
}

export async function getDashboardLanguages(userId: string): Promise<DashboardLanguageBreakdown> {
  const repoLanguages = await prisma.repositoryLanguage.findMany({
    where: {
      repository: {
        ownerId: userId,
      },
    },
    select: {
      name: true,
      bytes: true,
      repository: {
        select: {
          name: true,
        },
      },
    },
  });

  const totals: Record<string, { bytes: number; repos: Set<string> }> = {};
  let totalBytes = 0;

  for (const item of repoLanguages) {
    if (!totals[item.name]) {
      totals[item.name] = { bytes: 0, repos: new Set() };
    }
    totals[item.name].bytes += item.bytes;
    if (item.repository?.name) {
      totals[item.name].repos.add(item.repository.name);
    }
    totalBytes += item.bytes;
  }

  const languages = Object.entries(totals)
    .map(([name, data]) => ({
      name,
      bytes: data.bytes,
      repoCount: data.repos.size,
      percentage: totalBytes > 0 ? Number(((data.bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  

  return {
    totalBytes,
    languages,
  };
}

export async function getDashboardCommitActivity(userId: string): Promise<string[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 150);

  const commits = await prisma.commit.findMany({
    where: {
      repository: {
        ownerId: userId,
      },
      committedAt: {
        gte: cutoff,
      },
    },
    select: {
      committedAt: true,
    },
    orderBy: {
      committedAt: "asc",
    },
  });

  return commits.map((c) => c.committedAt.toISOString());
}

