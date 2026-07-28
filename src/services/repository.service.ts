import { prisma } from "@/src/server/prisma/client";
import { NotFoundError } from "@/src/services/session.service";

export async function getRepositoryById(repositoryId: string, ownerId?: string) {
  const repository = await prisma.repository.findFirst({
    where: {
      id: repositoryId,
      ...(ownerId ? { ownerId } : {}),
    },
    include: {
      stats: true,
      languages: true,
      owner: true,
    },
  });

  if (!repository) {
    throw new NotFoundError("Repository not found");
  }

  return repository;
}
