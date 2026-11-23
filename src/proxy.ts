
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Get authenticated user session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect unauthenticated users
  if (!session?.user) {
    const loginUrl = new URL("/signin", request.url);

    loginUrl.searchParams.set(
      "callbackURL",
      `${pathname}${search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  // Get user role
  const user = session.user as typeof session.user & {
    role?: string;
  };

  const userRole = user.role?.toLowerCase();

  // Dashboard routes based on user roles
  const roleRoutes: Record<string, string> = {
    admin: "/dashboard/admin",
    technician: "/dashboard/technician",
    customer: "/dashboard/customer",
  };

  // Determine required role
  let requiredRole: string | null = null;

  if (pathname.startsWith("/dashboard/admin")) {
    requiredRole = "admin";
  } else if (pathname.startsWith("/dashboard/technician")) {
    requiredRole = "technician";
  } else if (pathname.startsWith("/dashboard/customer")) {
    requiredRole = "customer";
  }

  // Check role authorization
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = roleRoutes[userRole ?? ""];

    if (redirectPath) {
      return NextResponse.redirect(
        new URL(redirectPath, request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/signin", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
  ],
};
