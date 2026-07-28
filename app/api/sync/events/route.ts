export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { requireCurrentUser, UnauthorizedError } from "@/src/services/session.service";
import { subscribeToUserEvents } from "@/src/services/realtime.service";

export async function GET() {
  try {
    const user = await requireCurrentUser();

    let cleanup: (() => void) | undefined;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const unsubscribe = subscribeToUserEvents(user.id, controller);
        const encoder = new TextEncoder();
        const heartbeat = setInterval(() => {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        }, 25_000);

        cleanup = () => {
          clearInterval(heartbeat);
          unsubscribe();
        };
      },
      cancel() {
        cleanup?.();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Failed to open sync event stream:", error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to open sync event stream" },
      { status: 500 },
    );
  }
}
