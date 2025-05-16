import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { PercentCircle, CreditCard } from "lucide-react";

export const discountValueColumn = {
  accessorKey: "discount_value",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Giá trị" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const discountValue = row.getValue("discount_value") as number;
    const discountType = row.original.discount_type;

    // Thích ứng với loại khuyến mãi: giá trị cố định hoặc phần trăm
    const isPercentage = discountType === "percentage";

    // Format giá trị dựa trên loại khuyến mãi
    const formattedValue = isPercentage
      ? `${discountValue}%`
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(discountValue);

    return (
      <div className="flex items-center gap-2">
        {isPercentage ? (
          <PercentCircle className="h-4 w-4 text-indigo-500" />
        ) : (
          <CreditCard className="h-4 w-4 text-emerald-500" />
        )}
        <span
          className={`font-medium ${
            isPercentage ? "text-indigo-600" : "text-emerald-600"
          }`}
        >
          {formattedValue}
        </span>
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

export default discountValueColumn;
