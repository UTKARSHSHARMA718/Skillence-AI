import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { USER_ROLE } from "./common/types/user.types";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Not logged in → block protected routes
    if (!token) {
      if (pathname.startsWith("/admin") || pathname.startsWith("/candidate")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // Prevent logged-in users from accessing auth pages
    if (pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password") {
      if (token.role === USER_ROLE.ADMIN) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (token.role === USER_ROLE.USER) {
        return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
      }
    }

    // Admin trying to access candidate pages
    if (pathname.startsWith("/candidate") && token.role !== USER_ROLE.USER) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Candidate trying to access admin pages
    if (pathname.startsWith("/admin") && token.role !== USER_ROLE.ADMIN) {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  },
);

export const config = {
  matcher: ["/login", "/forgot-password", "/reset-password", "/admin/:path*", "/candidate/:path*"],
};
