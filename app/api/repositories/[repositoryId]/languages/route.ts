import { NextResponse } from "next/server";
import { getLanguageStats } from "@/src/services/language.service";
import { NotFoundError, requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { repositoryId } = await params;
    const result = await getLanguageStats(repositoryId, user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
