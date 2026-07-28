export { auth as middleware } from "@/src/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/repos/:path*",
    "/repositories/:path*",
    "/github/profile/:path*",
  ],
};
