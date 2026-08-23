import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Helper: create redirect with refreshed cookies
  function redirectWithCookies(targetPath: string) {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    const redirectResp = NextResponse.redirect(url);
    response.cookies.getAll().forEach(({ name, value }) => {
      redirectResp.cookies.set(name, value);
    });
    return redirectResp;
  }

  // Protect /app routes — redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/app")) {
    return redirectWithCookies("/login");
  }

  // If authenticated and on login/signup, redirect to app
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return redirectWithCookies("/app");
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup"],
};
