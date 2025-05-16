import { UserRole } from "@/lib/enums/user-role-enum";
import { nextAuthAuth as auth } from "@/lib/next-auth/auth";
import { getRouteProtection } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

import {
  apiAuthPrefix,
  apiUploadPrefix,
  authRoutes,
  DEFAULT_REDIRECT,
  publicRoutes,
} from "@/routes";

// Helper function to check if a user has the required role
async function hasRequiredRole(
  token: string | undefined,
  allowedRoles: UserRole[]
) {
  // If no roles specified, all authenticated users have access
  if (allowedRoles.length === 0) return true;

  // No token, no access
  if (!token) return false;

  try {
    const response = await axios.post(
      "https://eprint.bohubo.com/api/auth/verify-token",
      { idToken: token }
    );

    if (response.data.code === 200) {
      const userRole = response.data.payload.role as UserRole;

      // Admin always has access to everything
      if (userRole === UserRole.ADMIN) return true;

      // Check if user has any of the allowed roles
      return allowedRoles.includes(userRole);
    }

    return false;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

export default auth(async (req) => {
  const nextUrl = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const token = (req.auth as any)?.firebaseToken;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiUploadRoute = nextUrl.pathname.startsWith(apiUploadPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // Specifically allow NextAuth API routes
  const isNextAuthRoute = nextUrl.pathname.startsWith('/api/auth');

  function hasMatchingPattern(routeUrl: string, routes: string[]) {
    return routes.some((route) => {
      const regex = new RegExp(route);
      return regex.test(routeUrl);
    });
  }

  const isAuthWithRoute = hasMatchingPattern(nextUrl.pathname, authRoutes);

  if (isApiAuthRoute || isNextAuthRoute) {
    return NextResponse.next();
  }

  if (isApiUploadRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && isAuthWithRoute) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Check for protected routes that require specific roles
  if (isLoggedIn && nextUrl.pathname.startsWith("/dashboard")) {
    const { isProtected, allowedRoles } = getRouteProtection(nextUrl.pathname);

    if (isProtected) {
      const hasAccess = await hasRequiredRole(token, allowedRoles);

      if (!hasAccess) {
        // Redirect to dashboard if user doesn't have the required role
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

// Update matcher to exclude NextAuth API routes
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
