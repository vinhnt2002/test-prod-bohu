import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export const nameColumn = {
  accessorKey: "name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên danh mục" />
  ),
  cell: ({ row }: { row: Row<ICategory> }) => {
    const category = row.original;
    const imageUrl = category.imageUrl;

    return (
      <div className="flex items-center space-x-3">
        {imageUrl ? (
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={category.name}
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          </div>
        ) : (
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium line-clamp-1">{category.name}</span>
        </div>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<ICategory>,
    columnId: string,
    filterValue: ICategory[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default nameColumn;
