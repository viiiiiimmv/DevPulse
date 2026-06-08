import { prisma } from "@/src/server/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json({
    success: true,
    users,
  });
}