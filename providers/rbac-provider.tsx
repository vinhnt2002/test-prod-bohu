"use client";

import { UserRole } from "@/lib/enums/user-role-enum";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

interface RBACContextType {
  userRole: UserRole | null;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSeller: () => boolean;
  hasRouteAccess: (allowedRoles?: UserRole[]) => boolean;
}

interface RBACResponse {
  code: number;
  message: string;
  payload: {
    token: string;
    userId: string;
    userInfo: Record<string, any>;
    role: string;
  };
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, logout } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post<RBACResponse>(
          "https://eprint.bohubo.com/api/auth/verify-token",
          { idToken: token }
        );

        if (response.data.code === 200) {
          // Convert the role string to UserRole enum
          const role = response.data.payload.role as UserRole;
          setUserRole(role);
        } else {
          console.error("Token verification failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, isAuthenticated]);

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  const isAdmin = (): boolean => {
    return userRole === UserRole.ADMIN;
  };

  const isSeller = (): boolean => {
    return userRole === UserRole.SELLER;
  };

  // Check if user has access to a specific route based on allowed roles
  const hasRouteAccess = (allowedRoles?: UserRole[]): boolean => {
    // If no roles specified, only Admin has access by default
    if (!allowedRoles) {
      return isAdmin();
    }

    // If empty array, all roles have access
    if (allowedRoles.length === 0) {
      return true;
    }

    // Admin always has access to everything
    if (isAdmin()) {
      return true;
    }

    // Check if user has any of the allowed roles
    return hasAnyRole(allowedRoles);
  };

  return (
    <RBACContext.Provider
      value={{
        userRole,
        isLoading,
        hasRole,
        hasAnyRole,
        isAdmin,
        isSeller,
        hasRouteAccess,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within a RBACProvider");
  }
  return context;
};
