import { NextResponse } from "next/server";

/**
 * Root middleware (copied to /src to ensure build NFT generation)
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = ["en", "fr"].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = "en";
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }

  const protectedRoutes = ["/verification", "/dashboard"];
  const isProtected = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user");
  const isAuthenticated = !!token || !!userCookie;

  if (isProtected && !isAuthenticated) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const currentPath = pathname + (search || "");
    if (typeof currentPath === "string" && currentPath.startsWith("/")) {
      loginUrl.searchParams.set("redirect", currentPath);
    }
    return NextResponse.redirect(loginUrl);
  }

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
      const locale = pathname.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
