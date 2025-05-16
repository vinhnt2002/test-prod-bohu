import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getOrderStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

export const orderStatusColumn = {
  accessorKey: "order_status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái đơn hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const orderStatus = row.original.order_status;
    return (
      <Badge
        className={cn(
          "rounded-md font-medium",
          getOrderStatusBadgeStyles(orderStatus)
        )}
      >
        {orderStatus}
      </Badge>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderStatusColumn;
