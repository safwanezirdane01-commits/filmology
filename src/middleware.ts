import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Middleware: Allow public access to home, search, movie pages, login, and register.
 * Protect only /admin and /profile routes.
 */
export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Require auth for /admin and /profile
        if (path.startsWith("/admin") || path.startsWith("/profile")) {
          return !!token;
        }
        // All other pages are public
        return true;
      },
    },
  }
);

// Apply middleware only to protected pages and API routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
  ],
};
