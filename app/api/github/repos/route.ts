export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/server/prisma/client";
import { syncGitHubRepositories } from "@/src/services/github-sync.service";
import { enqueueGitHubSyncJob } from "@/src/services/sync-queue.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();

    const repositories = await prisma.repository.findMany({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        githubUpdatedAt: "desc",
      },
      include: {
        stats: true,
        languages: true,
      },
    });

    return NextResponse.json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch repositories",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const [session, user] = await Promise.all([auth(), requireCurrentUser()]);

    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "GitHub access token not found" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const background = searchParams.get("background") === "true";

    if (background) {
      const job = await enqueueGitHubSyncJob({
        userId: user.id,
        username: user.username,
        accessToken,
      });

      return NextResponse.json({
        success: true,
        queued: true,
        ...job,
      });
    }

    const result = await syncGitHubRepositories({
      userId: user.id,
      username: user.username,
      accessToken,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Repository sync failed:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sync repositories",
      },
      { status: 500 },
    );
  }
}
