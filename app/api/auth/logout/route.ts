import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";
import { logActivity } from "@/src/lib/activitylogger";
import { prisma } from "@/src/server/prisma/client";

export async function POST() {
  const session = await getServerSession(authOptions);
  const githubId = session?.user?.githubId;

  if (githubId) {
    const dbUser = await prisma.user.findUnique({
      where: { githubId },
      select: { id: true },
    });

    if (dbUser) {
      await logActivity(dbUser.id, "USER_SIGNED_OUT");
    }
  }

  return NextResponse.json({ success: true });
}
