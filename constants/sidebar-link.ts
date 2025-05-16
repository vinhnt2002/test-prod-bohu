import { UserRole } from "@/lib/enums/user-role-enum";
import { LucideIcon, Settings } from "lucide-react";
import { IconType } from "react-icons";
import {
  FaCalendarPlus,
  FaGifts,
  FaListAlt,
  FaRegListAlt,
  FaUserCheck,
} from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import {
  MdMiscellaneousServices,
  MdSettingsApplications,
} from "react-icons/md";
export interface Route {
  label: string;
  icon: LucideIcon | IconType;
  activeIcon: LucideIcon | IconType;
  href?: string;
  isParent?: boolean;
  children?: Omit<Route, "isParent" | "children">[];
  allowedRoles?: UserRole[];
}

// If allowedRoles is not provided, only ADMIN has access by default
// If allowedRoles is empty array, all roles have access
export const routes: Route[] = [
  {
    label: "Trang chủ",
    icon: GoHome,
    activeIcon: GoHomeFill,
    href: "/dashboard",
    allowedRoles: [], // All roles have access
  },
  {
    label: "Quản lý sản phẩm",
    icon: MdMiscellaneousServices,
    activeIcon: MdMiscellaneousServices,
    isParent: true,
    allowedRoles: [UserRole.ADMIN, UserRole.SELLER], // Admin and Seller have access
    children: [
      {
        label: "Danh sách sản phẩm",
        href: "/dashboard/products",
        icon: FaRegListAlt,
        activeIcon: FaListAlt,
        allowedRoles: [UserRole.ADMIN, UserRole.SELLER],
      },
      {
        label: "Danh mục sản phẩm",
        href: "/dashboard/categories",
        icon: FaRegListAlt,
        activeIcon: FaListAlt,
        allowedRoles: [UserRole.ADMIN, UserRole.SELLER],
      },
      {
        label: "Bảng giá",
        icon: MdSettingsApplications,
        activeIcon: MdSettingsApplications,
        href: "/dashboard/products/settings",
        allowedRoles: [UserRole.ADMIN, UserRole.SELLER],
      },
    ],
  },
  {
    label: "Quản lý người bán",
    icon: FaRegListAlt,
    activeIcon: FaListAlt,
    href: "/dashboard/manage-seller",
    allowedRoles: [UserRole.ADMIN], // Only Admin has access
  },

  {
    label: "Quản lý giao dịch",
    icon: GrTransaction,
    activeIcon: GrTransaction,
    href: "/dashboard/orders",
    allowedRoles: [UserRole.ADMIN, UserRole.SELLER], // Admin and Seller have access
  },
  {
    label: "Danh sách khuyến mãi",
    icon: FaGifts,
    activeIcon: FaGifts,
    href: "/dashboard/promotions",
    allowedRoles: [UserRole.ADMIN], // Only Admin has access
  },

  {
    label: "Cài đặt",
    icon: Settings,
    activeIcon: Settings,
    isParent: true,
    allowedRoles: [UserRole.ADMIN], // Only Admin has access
    children: [
      {
        label: "Phí vận chuyển",
        href: "/dashboard/settings/shipping-fee",
        icon: FaUserPen,
        activeIcon: FaUserCheck,
        allowedRoles: [UserRole.ADMIN],
      },
      {
        label: "Giao diện",
        href: "/dashboard/settings/interface",
        icon: FaCalendarPlus,
        activeIcon: FaCalendarPlus,
        allowedRoles: [UserRole.ADMIN],
      },
    ],
  },
];
