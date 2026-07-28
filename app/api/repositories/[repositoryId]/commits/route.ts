import { NextResponse } from "next/server";
import { getRecentCommitsByRepository } from "@/src/services/commit.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { repositoryId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);

    const result = await getRecentCommitsByRepository(repositoryId, user.id, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
