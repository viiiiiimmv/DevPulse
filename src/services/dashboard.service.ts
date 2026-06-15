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
