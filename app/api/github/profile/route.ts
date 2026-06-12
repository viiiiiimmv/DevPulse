// app/api/github/profile/route.ts

import { auth } from "@/src/auth";
import { prisma } from "@/src/server/prisma/client";
import { getUserProfile } from "@/src/lib/github/github.service";
import { logActivity } from "@/src/lib/activitylogger";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session?.user?.githubId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!session.accessToken) {
    return NextResponse.json(
      { error: "No GitHub access token available" },
      { status: 401 }
    );
  }

  try {
    const profile = await getUserProfile(session.accessToken);

    // Get the user from database to have their ID
    const user = await prisma.user.findUnique({
      where: { githubId: session.user.githubId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Save to database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        githubId: profile.id.toString(),
        username: profile.login,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
      },
    });

    // Log the sync activity
    await logActivity(user.id, "GITHUB_DATA_SYNCED", {
      profile: {
        username: profile.login,
        repositories: profile.public_repos,
      }
    });

    return NextResponse.json({
      success: true,
      profile: {
        username: profile.login,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        publicRepos: profile.public_repos,
      }
    });
  } catch (error) {
    console.error("Error syncing GitHub profile:", error);
    return NextResponse.json(
      { error: "Failed to sync GitHub profile" },
      { status: 500 }
    );
  }
}