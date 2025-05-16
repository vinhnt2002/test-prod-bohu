import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default {
  accessorKey: "status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => {
    const status = row.getValue("status") as string;

    return (
      <div className="w-[100px]">
        <Badge
          variant={status === "active" ? "default" : "destructive"}
          className={cn("capitalize")}
        >
          {status === "active"
            ? "Hoạt động"
            : status === "pending"
            ? "Chờ duyệt"
            : "Đã khóa"}
        </Badge>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (row: Row<IStore>, id: string, value: string[]) => {
    return value.includes(row.getValue(id));
  },
} as const;
