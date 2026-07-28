import { NextResponse } from "next/server";
import { getRepositoryStats} from "@/src/services/analytics.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const repositoryAnalytics = await getRepositoryStats(user.id);

    return NextResponse.json(
      {
        success: true,
        data: repositoryAnalytics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch repository analytics:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch repository analytics",
      },
      { status: 500 }
    );
  }
}
