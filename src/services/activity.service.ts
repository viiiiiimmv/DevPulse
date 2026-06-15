import { prisma } from "@/src/server/prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";

export async function logActivity(
  userId: string,
  type: string,
  metadata?: JsonValue
) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        metadata: metadata ?? {},
      },
    });
  } catch (error) {
    console.error("Activity logging failed:", error);
  }
}
