import { NextResponse } from "next/server";

import { auth } from "@/src/auth";
import { scheduleGitHubSyncJob } from "@/src/services/sync-queue.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

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

    const body = (await request.json().catch(() => ({}))) as {
      intervalHours?: number;
    };
    const intervalHours = Number.isFinite(body.intervalHours)
      ? Number(body.intervalHours)
      : 24;

    const job = await scheduleGitHubSyncJob(
      {
        userId: user.id,
        username: user.username,
        accessToken,
      },
      intervalHours,
    );

    return NextResponse.json({
      success: true,
      scheduled: true,
      intervalHours: Math.min(Math.max(intervalHours, 1), 24 * 7),
      ...job,
    });
  } catch (error) {
    console.error("Failed to schedule GitHub sync:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to schedule GitHub sync" },
      { status: 500 },
    );
  }
}
