"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  CheckCircle2,
  Edit,
  Eye,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useState } from "react";
import {
  deletePromotion,
  updatePromotionStatus,
} from "../../../actions/promotion-action";
import Link from "next/link";

export enum PromotionType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export const PromotionTypeNames = {
  [PromotionType.PERCENTAGE]: "Phần trăm",
  [PromotionType.FIXED]: "Giá trị cố định",
};

const promotionTypeIcons = {
  [PromotionType.PERCENTAGE]: MdSystemUpdateAlt,
  [PromotionType.FIXED]: MdBuildCircle,
};

// import { useRouter } from "next/navigation";
import { MdBuildCircle, MdSystemUpdateAlt } from "react-icons/md";

const statusOptions = [
  {
    value: "active",
    label: "Đang hoạt động",
    icon: CheckCircle2,
    className: "text-green-500",
  },
  {
    value: "inactive",
    label: "Không hoạt động",
    icon: XCircle,
    className: "text-red-500",
  },
] as const;

interface ActionMenuProps {
  row: Row<IPromotion>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const currentStatus = row.original.active ? "active" : "inactive";
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Xử lý cập nhật trạng thái
  const handleStatusChange = async (value: string) => {
    try {
      const newStatus = value === "active";
      setIsUpdatingStatus(value);

      // Hiển thị thông báo bắt đầu cập nhật
      toast.info(
        `Đang cập nhật trạng thái khuyến mãi "${row.original.name}"...`
      );

      // Gọi API cập nhật trạng thái
      const result = await updatePromotionStatus(row.original._id, newStatus);

      if (result.success) {
        toast.success(
          `Đã chuyển khuyến mãi "${row.original.name}" sang trạng thái ${
            newStatus ? "Hoạt động" : "Không hoạt động"
          }`
        );
      } else {
        toast.error(`Cập nhật trạng thái thất bại: ${"Lỗi không xác định"}`);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Xử lý xóa khuyến mãi
  const handleDelete = async () => {
    // Hiển thị thông báo xác nhận
    toast.warning(`Xác nhận xóa khuyến mãi "${row.original.name}"?`, {
      action: {
        label: "Xóa",
        onClick: async () => {
          try {
            setIsDeleting(true);

            // Gọi API xóa khuyến mãi
            const result = await deletePromotion(row.original._id);

            if (result.success) {
              toast.success(`Đã xóa khuyến mãi "${row.original.name}"`);
            } else {
              toast.error(
                `Xóa khuyến mãi thất bại: ${
                  result.error || "Lỗi không xác định"
                }`
              );
            }
          } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa khuyến mãi");
            console.error("Error deleting promotion:", error);
          } finally {
            setIsDeleting(false);
          }
        },
      },
      cancel: {
        label: "Hủy",
        onClick: () => {
          // Không làm gì khi hủy
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => router.push(`/dashboard/promotions/${row.original._id}`)}
        title="Xem chi tiết"
      >
        <Eye className="h-4 w-4 text-primary" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        asChild
        title="Chỉnh sửa"
      >
        <Link href={`/dashboard/promotions/${row.original._id}/edit`}>
          <Edit className="h-4 w-4 text-primary" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Tùy chọn"
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!!isUpdatingStatus}>
              <div className="flex items-center gap-2">
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : row.original.active ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Trạng thái</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentStatus}
                onValueChange={handleStatusChange}
              >
                {statusOptions.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    className="capitalize"
                    disabled={isUpdatingStatus === status.value}
                  >
                    <div className="flex items-center">
                      {isUpdatingStatus === status.value ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <status.icon
                          className={cn("mr-2 h-4 w-4", status.className)}
                        />
                      )}
                      {status.label}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            <span>Xóa</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const actionColumn: ColumnDef<IPromotion> = {
  id: "actions",
  header: () => <div className="text-center">Thao tác</div>,
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
