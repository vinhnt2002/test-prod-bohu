import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const idColumn = {
  accessorKey: "_id",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mã đơn hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => (
    <p className="text-sm font-medium">{row.getValue("_id")}</p>
  ),
  enableSorting: false,
  enableHiding: false,
} as const;

export default idColumn;
