import { NextResponse } from "next/server";
import { getRepositoryById } from "@/src/services/repository.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  try {
    const { repositoryId } = await params;
    const repository = await getRepositoryById(repositoryId);

    // split repository and stats as requested
    const { stats, ...repoData } = repository;

    return NextResponse.json({
      repository: repoData,
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch repository:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository" },
      { status: 404 }
    );
  }
}
