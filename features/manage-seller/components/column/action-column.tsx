import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, BarChart2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeactivateSellerDialog } from "../dialogs/delete-seller-dialog";

export default {
  id: "actions",
  cell: ({ row }: { row: Row<IStore> }) => {
    const seller = row.original;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-seller/${seller.seller_id}`}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Chi tiết</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/manage-seller/${seller.seller_id}/analytics`}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Phân tích</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-seller/${seller.seller_id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Chỉnh sửa</span>
              </Link>
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-500"
            >
              <Lock className="mr-2 h-4 w-4" />
              <span>Chặn/Ngưng hoạt động</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {showDeleteDialog && (
          <DeactivateSellerDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            seller={seller}
          />
        )}
      </>
    );
  },
} as const;
