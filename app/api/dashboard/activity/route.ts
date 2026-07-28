import { NextResponse } from "next/server";
import { prisma } from "@/src/server/prisma/client";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("Failed to fetch dashboard activities:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
