import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ShoppingCart, ShoppingBag, DollarSign, Star } from "lucide-react";

export default {
  accessorKey: "metrics",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Thống kê" />
  ),
  cell: ({ row }: { row: Row<IStore> }) => {
    const metrics = row.getValue("metrics") as IStore["metrics"];

    return (
      <div className="flex flex-col gap-1 max-w-[200px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">Sản phẩm:</span>
          </div>
          <span className="text-xs font-medium">{metrics.totalProducts}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ShoppingCart className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">Đơn hàng:</span>
          </div>
          <span className="text-xs font-medium">{metrics.totalOrders}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">Doanh thu:</span>
          </div>
          <span className="text-xs font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(metrics.totalRevenue)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">Đánh giá:</span>
          </div>
          <span className="text-xs font-medium">
            {metrics.averageRating.toFixed(1)} ⭐
          </span>
        </div>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;
