import {prisma} from "@/src/server/prisma/client"
import { NotFoundError } from "@/src/services/session.service";

export interface languageStat {
    name : string;
    bytes : number;
    percentage : number;
}

export interface languageStatsResponse{
    repositoryId: string;
    totalBytes : number;
    languages : languageStat[];
}

export async function getLanguageStats(
  repositoryId: string,
  ownerId?: string
): Promise<languageStatsResponse> {
  const repository = await prisma.repository.findFirst({
    where: {
      id: repositoryId,
      ...(ownerId ? { ownerId } : {}),
    },
    select: {
      id: true,
      languages: {
        orderBy: {
          bytes: "desc",
        },
      },
    },
  });

  if (!repository) {
    throw new NotFoundError("Repository not found");
  }

  const totalBytes = repository.languages.reduce(
    (sum, language) => sum + language.bytes,
    0
  );

  return {
    repositoryId: repository.id,
    totalBytes,
    languages: repository.languages.map((language) => ({
      name: language.name,
      bytes: language.bytes,
      percentage:
        totalBytes === 0
          ? 0
          : Number(
              ((language.bytes / totalBytes) * 100).toFixed(2)
            ),
    })),
  };
}
