import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";

export default {
  accessorKey: "name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên cửa hàng" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;
