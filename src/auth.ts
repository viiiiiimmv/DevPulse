import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import NextAuth, {
  getServerSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
import { getToken } from "next-auth/jwt";
import Github, { type GithubProfile } from "next-auth/providers/github";

import { prisma } from "@/src/server/prisma/client";
import { logActivity } from "@/src/lib/activitylogger";

type AuthRedirectOptions = {
  callbackUrl?: string;
  redirectTo?: string;
};

function isGitHubProfile(profile: unknown): profile is GithubProfile {
  if (typeof profile !== "object" || profile === null) {
    return false;
  }

  const candidate = profile as { id?: unknown; login?: unknown };

  return (
    (typeof candidate.id === "number" || typeof candidate.id === "string") &&
    typeof candidate.login === "string" &&
    candidate.login.length > 0
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, profile }) {
      if (!isGitHubProfile(profile)) {
        return false;
      }

      const githubId = String(profile.id);
      const name = user.name ?? profile.name ?? profile.login;
      const email = user.email ?? profile.email ?? null;
      const avatarUrl = user.image ?? profile.avatar_url ?? null;

      const dbUser = await prisma.user.upsert({
        where: { githubId },
        update: {
          username: profile.login,
          email,
          avatarUrl,
          name,
        },
        create: {
          githubId,
          username: profile.login,
          email,
          avatarUrl,
          name,
        },
      });

      await logActivity(dbUser.id, "USER_SIGNED_IN");

      return true;
    },

    async jwt({ token, profile, account }) {
      if (isGitHubProfile(profile)) {
        token.githubId = String(profile.id);
        token.username = profile.login;
        token.avatarUrl = profile.avatar_url ?? null;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (account || token.sub === token.githubId || !token.username) {
        const user =
          (token.githubId &&
            (await prisma.user.findUnique({
              where: { githubId: token.githubId },
              select: { githubId: true, username: true, avatarUrl: true, id: true },
            }))) ||
          (token.email &&
            (await prisma.user.findUnique({
              where: { email: token.email },
              select: { githubId: true, username: true, avatarUrl: true, id: true },
            })));

        if (user) {
          token.githubId = user.githubId;
          token.username = user.username;
          token.avatarUrl = user.avatarUrl;
          token.sub = user.id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.githubId = token.githubId ?? null;
        session.user.username = token.username ?? null;
        session.user.avatarUrl = token.avatarUrl ?? session.user.image ?? null;
        session.user.id = token.sub ?? null;
        session.accessToken = token.accessToken ?? undefined;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const handlers = {
  GET: handler,
  POST: handler,
};

export function auth(): Promise<Session | null>;
export function auth(request: NextRequest): Promise<NextResponse>;
export function auth(request?: NextRequest) {
  if (request) {
    return authMiddleware(request);
  }

  return getServerSession(authOptions);
}

async function authMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export async function signIn(provider: string, options?: AuthRedirectOptions) {
  const callbackUrl = options?.redirectTo ?? options?.callbackUrl;
  const url = new URL(`/api/auth/signin/${provider}`, "http://localhost");

  if (callbackUrl) {
    url.searchParams.set("callbackUrl", callbackUrl);
  }

  redirect(`${url.pathname}${url.search}`);
}

export async function signOut(options?: AuthRedirectOptions) {
  const session = await auth();
  const githubId = session?.user?.githubId;

  if (githubId) {
    const dbUser = await prisma.user.findUnique({
      where: { githubId },
      select: { id: true },
    });

    if (dbUser) {
      await logActivity(dbUser.id, "USER_SIGNED_OUT");
    }
  }

  const redirectTo = options?.redirectTo ?? "/login";
  redirect(`/api/auth/signout?redirectTo=${encodeURIComponent(redirectTo)}`);
}
