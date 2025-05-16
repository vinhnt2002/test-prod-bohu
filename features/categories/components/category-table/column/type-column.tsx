import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const typeColumn = {
  accessorKey: "type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Thể loại" />
  ),
  cell: ({ row }: { row: Row<ICategory> }) => {
    return (
      <div className="flex items-center">
        <span className="max-w-[100px] break-words font-medium overflow-hidden">
              {row.getValue("type")}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (
    row: Row<ICategory>,
    columnId: string,
    filterValue: ICategory[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default typeColumn;
