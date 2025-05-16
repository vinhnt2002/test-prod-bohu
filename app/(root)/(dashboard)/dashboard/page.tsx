"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRBAC } from "@/hooks/use-rbac";
import { UserRole } from "@/lib/enums/user-role-enum";
import { cn, routePermissions } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle,
  CreditCard,
  Package,
  Settings,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const DashboardCard = ({
  title,
  description,
  icon,
  href,
}: DashboardCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      <Link href={href}>
        <div className="flex h-full flex-col">
          <CardHeader className={cn("flex flex-row items-center gap-4")}>
            <div className="p-2 rounded-md">{icon}</div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between mt-auto p-4">
            <span className="text-sm text-muted-foreground">Xem chi tiết</span>
            <ArrowRight className="h-5 w-5" />
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
};

const DashboardPage = () => {
  const { userRole, isLoading } = useRBAC();
  const [accessibleRoutes, setAccessibleRoutes] = useState<string[]>([]);
  const [roleDisplay, setRoleDisplay] = useState<string>("");

  useEffect(() => {
    if (!isLoading && userRole) {
      const routes = Object.entries(routePermissions)
        .filter(([_, roles]) => {
          // If empty array, all roles have access
          if (roles.length === 0) return true;
          // Admin has access to everything
          if (userRole === UserRole.ADMIN) return true;
          // Check if user role is in allowed roles
          return roles.includes(userRole as never);
        })
        .map(([route]) => route);

      setAccessibleRoutes(routes);

      // Set role display name
      switch (userRole) {
        case UserRole.ADMIN:
          setRoleDisplay("Quản trị viên");
          break;
        case UserRole.SELLER:
          setRoleDisplay("Người bán");
          break;
        case UserRole.MANAGER:
          setRoleDisplay("Quản lý");
          break;
        case UserRole.REVIEWER:
          setRoleDisplay("Người duyệt");
          break;
        default:
          setRoleDisplay("Người dùng");
      }
    }
  }, [userRole, isLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-6 w-[350px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Define dashboard cards with all options first
  const allDashboardCards: DashboardCardProps[] = [
    {
      title: "Trang chủ",
      description: "Tổng quan về hệ thống",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/dashboard",
    },
    {
      title: "Quản lý sản phẩm",
      description: "Quản lý danh sách sản phẩm",
      icon: <Package className="h-6 w-6" />,
      href: "/dashboard/products",
    },
    {
      title: "Quản lý đơn hàng",
      description: "Quản lý giao dịch và đơn hàng",
      icon: <CreditCard className="h-6 w-6" />,
      href: "/dashboard/orders",
    },
    {
      title: "Quản lý người bán",
      description: "Quản lý danh sách người bán",
      icon: <Store className="h-6 w-6" />,
      href: "/dashboard/manage-seller",
    },
    {
      title: "Khuyến mãi",
      description: "Quản lý chương trình khuyến mãi",
      icon: <CalendarDays className="h-6 w-6" />,
      href: "/dashboard/promotions",
    },
    {
      title: "Cài đặt",
      description: "Cài đặt hệ thống",
      icon: <Settings className="h-6 w-6" />,
      href: "/dashboard/settings",
    },
  ];

  // Filter cards based on user's permissions
  const dashboardCards = allDashboardCards.filter((card) => {
    // Trang chủ (Dashboard) always visible
    if (card.href === "/dashboard") return true;

    // Check if user has access to this route
    return accessibleRoutes.includes(card.href);
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome section */}
      <div className="rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Xin chào, {roleDisplay}!</h1>
        <p className="">
          Chào mừng bạn đến với hệ thống quản lý Print E-Commerce.
        </p>

        <div className="flex gap-2 mt-4">
          <Badge variant="default" className="border-none">
            Vai trò: {roleDisplay}
          </Badge>
          {userRole === UserRole.ADMIN && (
            <Badge
              variant="outline"
              className="bg-amber-500/80 text-white border-none"
            >
              <CheckCircle className="mr-1 h-3 w-3" /> Toàn quyền
            </Badge>
          )}
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="space-y-4 mt-8">
        {dashboardCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Store className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-xl font-medium">Không có chức năng nào</h3>
              <p className="text-muted-foreground">
                Vui lòng liên hệ với quản trị viên để được cấp quyền truy cập.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Quick tips */}
      <Card className="mt-6 bg-slate-50 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Mẹo nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Sử dụng thanh điều hướng bên trái để truy cập nhanh các tính năng
            </li>
            <li>
              Nhấn vào hồ sơ của bạn ở góc trên bên phải để quản lý tài khoản
            </li>
            <li>
              Sử dụng chức năng tìm kiếm để nhanh chóng tìm thấy thông tin bạn
              cần
            </li>
            {userRole === UserRole.ADMIN && (
              <li>
                Với quyền Admin, bạn có thể truy cập tất cả các tính năng của hệ
                thống
              </li>
            )}
            {userRole === UserRole.SELLER && (
              <li>
                Với quyền Seller, bạn có thể quản lý sản phẩm và đơn hàng của
                mình
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
