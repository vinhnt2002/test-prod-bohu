import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export default {
  accessorKey: "_id",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="ID" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => (
    <div className="w-[80px] truncate">{row.getValue("_id")}</div>
  ),
  enableSorting: false,
  enableHiding: false,
} as const;
