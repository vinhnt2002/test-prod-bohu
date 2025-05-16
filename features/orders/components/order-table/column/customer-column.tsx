import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const customerColumn = {
  accessorKey: "customer",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Khách hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const customer = row.original.customer;
    return (
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{customer.email}</span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;

export default customerColumn;
