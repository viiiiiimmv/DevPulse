import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { getRepositoryStats} from "@/src/services/analytics.service";
import { getUserByEmail } from "@/src/services/user.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(
      {
        error: "Failed to fetch repository analytics",
      },
      { status: 500 }
    );
  }
}