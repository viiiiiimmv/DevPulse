import { NextResponse } from "next/server";
import { prisma } from "@/src/server/prisma/client";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const repositories = await prisma.repository.findMany({
      where: { ownerId: user.id },
      orderBy: { githubUpdatedAt: "desc" },
      take: 5,
      include: { languages: true },
    });

    return NextResponse.json({ success: true, repositories });
  } catch (error) {
    console.error("Failed to fetch dashboard repos:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
