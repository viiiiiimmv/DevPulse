import { prisma } from "@/src/server/prisma/client";

export async function getRecentCommitsByRepository(
  repositoryId: string,
  ownerId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  const boundedLimit = Math.min(Math.max(limit, 1), 100);

  const [commits, total] = await Promise.all([
    prisma.commit.findMany({
      where: { repositoryId, repository: { ownerId } },
      orderBy: { committedAt: "desc" },
      skip,
      take: boundedLimit,
    }),
    prisma.commit.count({
      where: { repositoryId, repository: { ownerId } },
    }),
  ]);

  const totalPages = Math.ceil(total / boundedLimit);

  return {
    commits,
    pagination: {
      page,
      limit: boundedLimit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
