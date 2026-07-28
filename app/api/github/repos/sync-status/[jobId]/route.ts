import { NextResponse } from "next/server";

import { getGitHubSyncJobStatus } from "@/src/services/sync-queue.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    await requireCurrentUser();
    const { jobId } = await params;
    const status = await getGitHubSyncJobStatus(jobId);

    if (!status) {
      return NextResponse.json({ error: "Sync job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Failed to fetch sync job status:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch sync job status" },
      { status: 500 },
    );
  }
}
