import { NextResponse } from "next/server";

/**
 * Root middleware
 * - Adds locale redirect when missing
 * - Protects selected routes server-side (verification, dashboard)
 * - Redirects unauthenticated users to `/<locale>/login?redirect=<currentPath>`
 * - Redirects authenticated users away from login/register to their dashboard
 *
 * Notes:
 * - This checks for either a `token` cookie or a `user` cookie (stringified JSON).
 * - For best security, set `token` as an HttpOnly cookie on the server and validate JWTs here.
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Skip internal Next.js and asset requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If there's no locale segment (e.g. /about instead of /en/about), redirect to default locale
  const pathnameIsMissingLocale = ["en", "fr"].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = "en";
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }

  // Routes we consider protected (prefixes are matched)
  const protectedRoutes = ["/verification", "/dashboard"];
  const isProtected = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Read cookies (server-side)
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user");
  const isAuthenticated = !!token || !!userCookie;

  // If requesting protected route and not authenticated -> redirect to login with redirect param
  if (isProtected && !isAuthenticated) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const currentPath = pathname + (search || "");
    if (typeof currentPath === "string" && currentPath.startsWith("/")) {
      loginUrl.searchParams.set("redirect", currentPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If user is on login/register but already authenticated, send to dashboard
  if (isAuthRoute && isAuthenticated) {
    try {
      const user = userCookie ? JSON.parse(userCookie.value) : null;
      const locale = pathname.split("/")[1] || "en";
      const dashboardRoutes = {
        admin: `/${locale}/dashboard/admin`,
        client: `/${locale}/dashboard/client`,
        partner: `/${locale}/dashboard/partner`,
      };
      const dest = user?.role
        ? dashboardRoutes[user.role] || `/${locale}`
        : `/${locale}`;
      return NextResponse.redirect(new URL(dest, request.url));
    } catch (error) {
      // ignore parse error and allow auth page
    }
  }

  // Role-based access control for dashboard routes (if authenticated)
  if (pathname.startsWith("/dashboard") && isAuthenticated) {
    try {
      const user = userCookie ? JSON.parse(userCookie.value) : null;
      const requiredRole = pathname.includes("/dashboard/admin")
        ? "admin"
        : pathname.includes("/dashboard/partner")
        ? "partner"
        : pathname.includes("/dashboard/client")
        ? "client"
        : null;

      if (requiredRole && user?.role && user.role !== requiredRole) {
        const locale = pathname.split("/")[1] || "en";
        const dashboardRoutes = {
          admin: `/${locale}/dashboard/admin`,
          client: `/${locale}/dashboard/client`,
          partner: `/${locale}/dashboard/partner`,
        };
        return NextResponse.redirect(
          new URL(dashboardRoutes[user.role] || `/${locale}`, request.url)
        );
      }
    } catch (error) {
      // Invalid cookie -> redirect to login
      const locale = pathname.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Keep the matcher broad to allow locale redirection for top-level routes.
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
