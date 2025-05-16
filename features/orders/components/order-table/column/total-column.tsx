import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const totalColumn = {
  accessorKey: "total",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tổng tiền" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const total = row.original.total;
    const currency = row.original.currency || "USD";

    // Format the total as a currency value
    const formattedTotal = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(total);

    return <div className="font-medium text-right">{formattedTotal}</div>;
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default totalColumn;
