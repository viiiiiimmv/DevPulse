export type DevPulseEvent = {
  type: string;
  createdAt: string;
  payload?: Record<string, unknown>;
};

type Subscriber = {
  controller: ReadableStreamDefaultController<Uint8Array>;
};

const globalRealtime = globalThis as typeof globalThis & {
  devpulseSubscribers?: Map<string, Set<Subscriber>>;
};

const subscribers =
  globalRealtime.devpulseSubscribers ?? new Map<string, Set<Subscriber>>();
globalRealtime.devpulseSubscribers = subscribers;

const encoder = new TextEncoder();

function serializeEvent(event: DevPulseEvent) {
  return encoder.encode(`event: devpulse\ndata: ${JSON.stringify(event)}\n\n`);
}

export function subscribeToUserEvents(
  userId: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
) {
  const subscriber = { controller };
  const userSubscribers = subscribers.get(userId) ?? new Set<Subscriber>();
  userSubscribers.add(subscriber);
  subscribers.set(userId, userSubscribers);

  controller.enqueue(
    serializeEvent({
      type: "CONNECTED",
      createdAt: new Date().toISOString(),
    }),
  );

  return () => {
    userSubscribers.delete(subscriber);
    if (userSubscribers.size === 0) {
      subscribers.delete(userId);
    }
  };
}

export function emitUserEvent(userId: string, event: Omit<DevPulseEvent, "createdAt">) {
  const userSubscribers = subscribers.get(userId);
  if (!userSubscribers) {
    return;
  }

  const payload = serializeEvent({
    ...event,
    createdAt: new Date().toISOString(),
  });

  for (const subscriber of userSubscribers) {
    try {
      subscriber.controller.enqueue(payload);
    } catch {
      userSubscribers.delete(subscriber);
    }
  }
}
