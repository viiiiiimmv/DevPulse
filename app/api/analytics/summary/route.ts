import { NextResponse } from "next/server";

import { getDeveloperSummary } from "@/src/services/analytics.service";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const data = await getDeveloperSummary(user.id);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch developer summary:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch developer summary" },
      { status: 500 },
    );
  }
}
