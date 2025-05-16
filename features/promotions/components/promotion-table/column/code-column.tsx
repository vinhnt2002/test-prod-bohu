import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Row, type Column } from "@tanstack/react-table";
import { Ticket, Copy } from "lucide-react";
import { toast } from "sonner";

export const codeColumn = {
  accessorKey: "code",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mã khuyến mãi" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const code = row.getValue("code") as string;

    // Hàm sao chép mã giảm giá vào clipboard
    const copyCodeToClipboard = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã: ${code}`);
    };

    return (
      <div className="flex items-center gap-2 cursor-pointer group">
        <Ticket className="h-4 w-4 text-primary opacity-70" />
        <Badge
          variant="outline"
          className="font-mono text-xs bg-primary/5 hover:bg-primary/10 transition-colors px-2 py-0.5"
        >
          {code}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={copyCodeToClipboard}
          title="Sao chép mã"
        >
          <Copy className="h-4 w-4" />
        </Button>
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

export default codeColumn;
