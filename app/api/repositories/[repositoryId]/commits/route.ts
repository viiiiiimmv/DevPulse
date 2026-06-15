import { NextResponse } from "next/server";
import { getRecentCommitsByRepository } from "@/src/services/commit.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  try {
    const { repositoryId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await getRecentCommitsByRepository(repositoryId, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
