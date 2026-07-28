import { auth } from "@/src/auth";
import { prisma } from "@/src/server/prisma/client";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function getCurrentUser() {
  const session = await auth();

  if (session?.user?.id) {
    return prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }

  if (session?.user?.githubId) {
    return prisma.user.findUnique({
      where: { githubId: session.user.githubId },
    });
  }

  if (session?.user?.email) {
    return prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  return null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}
