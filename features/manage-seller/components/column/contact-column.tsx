import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";

export default {
  accessorKey: "contact",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Liên hệ" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => {
    const contact = row.getValue("contact") as IStore["contact"];

    return (
      <div className="flex flex-col gap-1 max-w-[200px]">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="truncate text-sm">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="truncate text-sm">{contact.phone}</span>
        </div>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;
