import { prisma } from "@/src/server/prisma/client";

export async function getUserStats(userId: string) {
  try {
    const [
      totalRepositories,
      totalCommits,
      activityCount,
      repoAggregates,
    ] = await Promise.all([
      // Total Repositories
      prisma.repository.count({
        where: { ownerId: userId },
      }),

      // Total Commits
      prisma.commit.count({
        where: {
          repository: {
            ownerId: userId,
          },
        },
      }),

      // Activity Count
      prisma.activity.count({
        where: { userId },
      }),

      // Total Stars and Forks
      prisma.repository.aggregate({
        where: { ownerId: userId },
        _sum: {
          stars: true,
          forks: true,
        },
      }),
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Weekly Commit Count
    const weeklyCommitCount = await prisma.commit.count({
      where: {
        repository: {
          ownerId: userId,
        },
        committedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      totalRepositories,
      totalCommits,
      totalStars: repoAggregates._sum.stars || 0,
      totalForks: repoAggregates._sum.forks || 0,
      activityCount,
      weeklyCommitCount,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
}
