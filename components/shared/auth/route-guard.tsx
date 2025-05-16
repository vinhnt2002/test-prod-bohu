"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useRBAC } from "@/hooks/use-rbac";
import { getRouteProtection } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function RouteGuard({
  children,
  fallbackPath = "/dashboard",
}: RouteGuardProps) {
  const { hasRouteAccess, isAdmin, isLoading } = useRBAC();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Check the route protection based on the current pathname
    const { isProtected, allowedRoles } = getRouteProtection(pathname);

    if (isProtected) {
      // Admin always has access
      if (isAdmin()) return;

      // If empty array, all roles have access
      if (allowedRoles.length === 0) return;

      // Check if user has any of the allowed roles
      if (!hasRouteAccess(allowedRoles)) {
        router.push(fallbackPath);
      }
    }
  }, [hasRouteAccess, isAdmin, isLoading, router, fallbackPath, pathname]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 w-[80%]">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-80 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
