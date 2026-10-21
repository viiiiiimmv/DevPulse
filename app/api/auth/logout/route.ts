import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";
import { logActivity } from "@/src/services/activity.service";
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

  const response = NextResponse.json({ success: true });

  // Clear NextAuth session and CSRF cookies
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("__Host-next-auth.csrf-token");
  response.cookies.delete("next-auth.callback-url");
  response.cookies.delete("__Secure-next-auth.callback-url");

  return response;
}
