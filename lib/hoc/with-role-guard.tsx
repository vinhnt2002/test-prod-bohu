"use client";

import { RouteGuard } from "@/components/shared/auth/route-guard";
import { UserRole } from "@/lib/enums/user-role-enum";
import { ComponentType } from "react";

interface WithRoleGuardProps {
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

/**
 * Higher-order component to protect routes based on user roles
 * @param Component - The component to protect
 * @param options - Configuration options
 * @returns A wrapped component that checks user roles before rendering
 */
export function withRoleGuard<P extends object>(
  Component: ComponentType<P>,
  options: WithRoleGuardProps = {}
) {
  const { allowedRoles, fallbackPath = "/dashboard" } = options;

  function WrappedComponent(props: P) {
    return (
      <RouteGuard fallbackPath={fallbackPath}>
        <Component {...props} />
      </RouteGuard>
    );
  }

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || "Component";
  WrappedComponent.displayName = `withRoleGuard(${displayName})`;

  return WrappedComponent;
}
