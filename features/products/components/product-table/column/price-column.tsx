import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const priceColumn = {
  accessorKey: "defaultPrice",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Giá" />
  ),
  cell: ({ row }: { row: Row<IProduct> }) => {
    const price = parseFloat(row.getValue("defaultPrice"));
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

    return (
      <div className="flex items-center">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {formatted}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<IProduct>,
    columnId: string,
    filterValue: IProduct[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default priceColumn;
