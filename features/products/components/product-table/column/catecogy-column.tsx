import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const categoryColumn = {
  accessorKey: "category",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Danh mục" />
  ),
  cell: ({ row }: { row: Row<IProduct> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("category")}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (
    row: Row<IProduct>,
    columnId: string,
    filterValue: IProduct[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },


} as const;

export default categoryColumn;
