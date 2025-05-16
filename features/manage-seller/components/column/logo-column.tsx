import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import Image from "next/image";

export default {
  accessorKey: "logo",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Logo" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => {
    const logoUrl = row.getValue("logo") as string | null;

    return (
      <div className="flex items-center justify-center w-[60px] h-[60px]">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${row.getValue("name")} logo`}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-[50px] h-[50px] rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
            No Logo
          </div>
        )}
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;
