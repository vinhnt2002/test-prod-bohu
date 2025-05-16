import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { useRouter } from "nextjs-toploader/app";
import { format, parseISO } from "date-fns";
import { uk } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export const nameColumn = {
  accessorKey: "name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Khuyến mãi" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const startDate = parseISO(row.original.start_date);
    const endDate = parseISO(row.original.end_date);
    const now = new Date();
    const isUpcoming = now < startDate;

    const dateDisplay = isUpcoming
      ? `Bắt đầu: ${format(startDate, "dd/MM/yyyy", { locale: uk })}`
      : `Kết thúc: ${format(endDate, "dd/MM/yyyy", { locale: uk })}`;

    return (
      <div className="cursor-pointer group space-y-1">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {dateDisplay}
        </div>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<IPromotion>,
    columnId: string,
    filterValue: IPromotion[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default nameColumn;
