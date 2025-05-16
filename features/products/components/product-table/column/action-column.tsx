"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckCircle2, Edit, Eye, XCircle } from "lucide-react";

export enum ServiceType {
  SYSTEM = "SYSTEM",
  DISASSEMBLE = "DISASSEMBLE",
  PORTER = "PORTER",
  TRUCK = "TRUCK",
  INSURANCE = "INSURANCE",
}

// import { useRouter } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

interface ActionMenuProps {
  row: Row<IProduct>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
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
            router.push(`/dashboard/products/${row.original.slug}`);
          }}
        >
          <span>Chi tiết</span>
          <Eye className="ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/products/${row.original.slug}/edit`);
          }}
        >
          <span>Chỉnh sửa</span>
          <Edit className="ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // startTransition(() => {
            //   row.toggleSelected(false);
            //   toast.promise(
            //     deleteAuction(row.original.auctionId.toString()),
            //     {
            //       loading: "Deleting...",
            //       success: () => "Auction deleted successfully.",
            //       // error: (err: unknown) => catchError(err),
            //       error: () => "Dellete error",
            //     }
            //   );
            // });
          }}
        >
          Xóa
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const actionColumn: ColumnDef<IProduct> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
