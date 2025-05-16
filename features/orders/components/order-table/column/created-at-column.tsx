import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export const createdAtColumn = {
  accessorKey: "created_at",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ngày tạo" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const timestamp = row.original.created_at;
    const date = new Date(timestamp);

    // Format the date in a human-readable format
    const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: enGB });

    return <div className="font-medium">{formattedDate}</div>;
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default createdAtColumn;
