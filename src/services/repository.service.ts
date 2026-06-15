import { prisma } from "@/src/server/prisma/client";

export async function getRepositoryById(repositoryId: string) {
  const repository = await prisma.repository.findUnique({
    where: { id: repositoryId },
    include: {
      stats: true,
      languages: true,
      owner: true,
    },
  });

  if (!repository) {
    throw new Error("Repository not found");
  }

  return repository;
}
