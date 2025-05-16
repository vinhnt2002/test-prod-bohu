import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { Package } from "lucide-react";

export const productCountColumn = {
  accessorKey: "productCount",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Số sản phẩm" />
  ),
  cell: ({ row }: { row: Row<ICategory> }) => {
    const productCount = (row.getValue("productCount") as number) || 0;

    return (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{productCount}</span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default productCountColumn;
