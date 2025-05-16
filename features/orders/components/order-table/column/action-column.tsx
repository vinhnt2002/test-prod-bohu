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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CheckCircle2, Edit, XCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";

export enum ServiceType {
  SYSTEM = "SYSTEM",
  DISASSEMBLE = "DISASSEMBLE",
  PORTER = "PORTER",
  TRUCK = "TRUCK",
  INSURANCE = "INSURANCE",
}
import { FaUserShield } from "react-icons/fa6";
export const ServiceTypeNames = {
  [ServiceType.SYSTEM]: "Hệ thống",
  [ServiceType.DISASSEMBLE]: "Tháo lắp",
  [ServiceType.PORTER]: "Nhân công",
  [ServiceType.TRUCK]: "Vận chuyển",
  [ServiceType.INSURANCE]: "Bảo hiểm",
};

const serviceTypeIcons = {
  [ServiceType.SYSTEM]: MdSystemUpdateAlt,
  [ServiceType.DISASSEMBLE]: MdBuildCircle,
  [ServiceType.INSURANCE]: MdBuildCircle,
  [ServiceType.PORTER]: MdPerson,
  [ServiceType.TRUCK]: MdLocalShipping,
};

// import { useRouter } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
  MdBuildCircle,
  MdLocalShipping,
  MdPerson,
  MdSystemUpdateAlt,
} from "react-icons/md";
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
  row: Row<IOrder>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const currentStatus = row.original.order_status ? "active" : "inactive";
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/orders/${row.original._id}`);
          }}
        >
          <span>Xem chi tiết</span>
          <Eye className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center">
              <span>Chuyển trạng thái</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={currentStatus}
              onValueChange={(value) => {
                const newStatus = value === "active";
              }}
            >
              {statusOptions.map((status) => (
                <DropdownMenuRadioItem
                  key={status.value}
                  value={status.value}
                  className="capitalize"
                >
                  <div className="flex items-center">
                    <status.icon
                      className={cn("mr-2 h-4 w-4", status.className)}
                    />
                    {status.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Loại dịch vụ</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={row.original.}>
              {Object.entries(ServiceTypeNames).map(([value, label]) => {
                const Icon = serviceTypeIcons[value as ServiceType];
                return (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    className="capitalize"
                  >
                    <div className="flex items-center">
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {label}
                    </div>
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground" disabled>
          Xóa
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const actionColumn: ColumnDef<IOrder> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
