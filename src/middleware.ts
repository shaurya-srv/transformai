import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/app"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    // For client-side auth, we let the layout handle the redirect
    // This middleware just ensures the routes exist properly
    // The actual auth check happens in the AppLayout component
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
