import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export const nameColumn = {
  accessorKey: "name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên sản phẩm" />
  ),
  cell: ({ row }: { row: Row<IProduct> }) => {
    const name = row.getValue("name") as string;
    const maxLength = 40;
    const truncatedName =
      name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
    return (
      <div className="flex items-center">
        <span
          className="max-w-[100px] break-words font-medium overflow-hidden transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-lg p-2 rounded"
          title={row.getValue("name")}
        >
          {truncatedName}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IProduct>, columnId: string, filterValue: IProduct[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default nameColumn;
