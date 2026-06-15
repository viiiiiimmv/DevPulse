import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { getUserStats } from "@/src/services/stats.service";
import { getUserByEmail } from "@/src/services/user.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stats = await getUserStats(user.id);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
