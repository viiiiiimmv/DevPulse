import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/server/prisma/client";
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

    const repositories = await prisma.repository.findMany({
      where: { ownerId: user.id },
      orderBy: { githubUpdatedAt: "desc" },
      take: 5,
      include: { languages: true },
    });

    return NextResponse.json({ success: true, repositories });
  } catch (error) {
    console.error("Failed to fetch dashboard repos:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
