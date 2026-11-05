import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/repos",
  "/repositories",
  "/github/profile",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionCookie =
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  let token = null;

  if (hasSessionCookie) {
    try {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
    } catch {
      token = null;
    }
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Protected route: require valid token or redirect to login
  if (isProtected) {
    if (token) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    const redirectResponse = NextResponse.redirect(loginUrl);
    if (hasSessionCookie) {
      redirectResponse.cookies.delete("next-auth.session-token");
      redirectResponse.cookies.delete("__Secure-next-auth.session-token");
    }
    return redirectResponse;
  }

  // Public route: if a stale or corrupted session cookie exists, purge it from
  // request headers and response cookies so downstream React Server Components
  // (RootLayout, Home) never encounter decryption errors.
  if (hasSessionCookie && !token) {
    request.cookies.delete("next-auth.session-token");
    request.cookies.delete("__Secure-next-auth.session-token");

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};