// Middleware to bypass NextAuth for the public subtitles API
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Public subtitles endpoint should be accessible without authentication.
 * This middleware runs for all routes (except static assets) and delegates
 * to NextAuth's `withAuth`. The `authorized` callback explicitly allows
 * unauthenticated access to `/api/subtitles*`.
 */
export default withAuth(
  (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    // If the request is for the subtitles API, skip auth checks.
    if (pathname.startsWith("/api/subtitles")) {
      return NextResponse.next();
    }
    // For all other routes, let NextAuth handle the request.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Public access for subtitles API
        if (path.startsWith("/api/subtitles")) return true;
        // Require a valid token for everything else
        return !!token;
      },
    },
  }
);

// Apply middleware to all pages except auth endpoints and static files.
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/subtitles/:path*",
  ],
};
