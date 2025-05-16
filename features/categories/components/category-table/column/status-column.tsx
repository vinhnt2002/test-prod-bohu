"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export const statusColumn = {
  accessorKey: "active",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<ICategory> }) => {
    const isActive = row.getValue("active") as boolean;

    return (
      <div className="flex items-center">
        {isActive ? (
          <Badge
            variant="outline"
            className="flex gap-1 items-center text-green-600 bg-green-50 border-green-200"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Đang hoạt động</span>
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex gap-1 items-center">
            <XCircle className="h-3.5 w-3.5" />
            <span>Không hoạt động</span>
          </Badge>
        )}
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (row: Row<ICategory>, columnId: string, filterValue: boolean) => {
    const value = row.getValue(columnId);
    return filterValue === undefined ? true : value === filterValue;
  },
} as const;

export default statusColumn;
