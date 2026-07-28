import { NextResponse } from "next/server";
import { getRepositoryById } from "@/src/services/repository.service";
import { NotFoundError, requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { repositoryId } = await params;
    const repository = await getRepositoryById(repositoryId, user.id);

    // split repository and stats as requested
    const { stats, ...repoData } = repository;

    return NextResponse.json({
      repository: repoData,
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch repository:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch repository" },
      { status: 500 }
    );
  }
}
