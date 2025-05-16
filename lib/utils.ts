import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./enums/user-role-enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Route permissions map
export const routePermissions = {
  // Admin-only routes
  "/dashboard/manage-seller": [UserRole.ADMIN],
  "/dashboard/promotions": [UserRole.ADMIN],
  "/dashboard/settings": [UserRole.ADMIN],

  // Admin and Seller routes
  "/dashboard/products": [UserRole.ADMIN, UserRole.SELLER],
  "/dashboard/orders": [UserRole.ADMIN, UserRole.SELLER],

  // Routes accessible to all authenticated users
  "/dashboard": [],
};

// Check if a route is protected and get the allowed roles
export function getRouteProtection(pathname: string) {
  for (const route in routePermissions) {
    // Exact match
    if (pathname === route) {
      return {
        isProtected: true,
        allowedRoles: routePermissions[route as keyof typeof routePermissions],
      };
    }

    // Prefix match for nested routes
    if (pathname.startsWith(`${route}/`)) {
      return {
        isProtected: true,
        allowedRoles: routePermissions[route as keyof typeof routePermissions],
      };
    }
  }

  return { isProtected: false, allowedRoles: [] };
}
