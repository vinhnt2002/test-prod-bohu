"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Route, routes } from "@/constants/sidebar-link";
import { useRBAC } from "@/hooks/use-rbac";
import { UserRole } from "@/lib/enums/user-role-enum";
import { Skeleton } from "@/components/ui/skeleton";

export function NavMain() {
  const pathname = usePathname();
  const { hasRouteAccess, isAdmin, isLoading } = useRBAC();

  const isRouteVisible = (route: Route) => {
    // If no allowedRoles specified, only Admin has access by default
    if (!route.allowedRoles) {
      return isAdmin();
    }

    // If allowedRoles is empty array, all roles have access
    if (route.allowedRoles.length === 0) {
      return true;
    }

    // Check if user has any of the allowed roles
    return hasRouteAccess(route.allowedRoles);
  };

  // Check if a parent route should be visible based on its children
  const isParentVisible = (route: Route) => {
    if (!route.children || route.children.length === 0) {
      return isRouteVisible(route);
    }

    // Parent is visible if at least one child is visible
    return route.children.some((child) => {
      const childRoute = {
        ...child,
        allowedRoles: child.allowedRoles || route.allowedRoles,
      };
      return isRouteVisible(childRoute);
    });
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
        <SidebarMenu>
          {[1, 2, 3, 4].map((i) => (
            <SidebarMenuItem key={i}>
              <Skeleton className="h-10 w-full" />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
      <SidebarMenu>
        {routes.filter(isParentVisible).map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          if (item.href) {
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className={cn(
                      "w-full transition-all duration-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 hover:text-white hover:shadow",
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 dark:hover:from-green-600 dark:hover:to-green-800"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-base font-semibold">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={item.children?.some(
                (child) => pathname === child.href
              )}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className={cn(
                      "transition-all duration-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 hover:text-white hover:shadow",
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 dark:hover:from-green-600 dark:hover:to-green-800"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-base font-semibold">
                      {item.label}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children
                      ?.filter((subItem) => {
                        // Inherit parent allowedRoles if child doesn't have its own
                        const childRoute = {
                          ...subItem,
                          allowedRoles:
                            subItem.allowedRoles || item.allowedRoles,
                        };
                        return isRouteVisible(childRoute);
                      })
                      .map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "transition-all font-medium hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 hover:text-white",
                              pathname === subItem.href
                                ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow"
                                : "text-neutral-600 dark:text-neutral-400"
                            )}
                          >
                            <Link href={subItem.href || ""}>
                              <subItem.icon className="w-5 h-5" />
                              <span className="text-sm">{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavMain;
