import { NextResponse } from "next/server";

import { getTopRepositories } from "@/src/services/analytics.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET(request: Request) {
  try {
    const user = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "3");
    const data = await getTopRepositories(user.id, Number.isFinite(limit) ? limit : 3);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch top repositories:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch top repositories" },
      { status: 500 },
    );
  }
}
