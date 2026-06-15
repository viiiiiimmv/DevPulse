import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { getCommitsStats } from "@/src/services/analytics.service";
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

    const commitStats = await getCommitsStats(user.id);

    return NextResponse.json(
      {
        success: true,
        data: commitStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch commit analytics:", error);

    return NextResponse.json(
      { error: "Failed to fetch commit analytics" },
      { status: 500 }
    );
  }
}