import { prisma } from "@/src/server/prisma/client";

export async function getRecentCommitsByRepository(
  repositoryId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [commits, total] = await Promise.all([
    prisma.commit.findMany({
      where: { repositoryId },
      orderBy: { committedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.commit.count({
      where: { repositoryId },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    commits,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
