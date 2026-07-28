import { prisma } from "@/src/server/prisma/client";
import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireCurrentUser();
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { success: false, error: "Database check failed" },
      { status: 500 },
    );
  }
}
