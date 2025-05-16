import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { PercentCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export enum PromotionType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export const PromotionTypeNames = {
  [PromotionType.PERCENTAGE]: "Phần trăm",
  [PromotionType.FIXED]: "Giá trị cố định",
};

export const discountTypeColumn = {
  accessorKey: "discount_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Loại giảm giá" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const discountType = row.original.discount_type;
    const isPercentage = discountType === PromotionType.PERCENTAGE;

    return (
      <div className="flex space-x-2 items-center">
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-medium",
            isPercentage
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
          )}
        >
          {isPercentage ? (
            <PercentCircle className="h-3 w-3 mr-1" />
          ) : (
            <CreditCard className="h-3 w-3 mr-1" />
          )}
          {PromotionTypeNames[discountType as keyof typeof PromotionTypeNames]}
        </Badge>
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

export default discountTypeColumn;
