import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // /dashboard is a role-based redirector — allow any authenticated user
    // it will redirect internally to /staff/dashboard or /student/dashboard
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      return NextResponse.next();
    }

    // /staff/* — only STAFF can access
    if (pathname.startsWith("/staff") && token?.role !== "STAFF") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // /student/* — only STUDENT can access
    if (pathname.startsWith("/student") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/staff/:path*", "/student/:path*"],
};
