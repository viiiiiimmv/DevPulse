import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      githubId?: string | null;
      username?: string | null;
      avatarUrl?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  }
}
