import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { CheckCircle, ShoppingBag, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const availableWithProductColumn = {
  accessorKey: "apply_to_all_products",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Phạm vi áp dụng" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const applyToAllProducts = row.getValue("apply_to_all_products") as boolean;
    const productIds = row.original.product_ids || [];

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {applyToAllProducts ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                  >
                    Tất cả sản phẩm
                  </Badge>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 text-amber-500" />
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-300"
                  >
                    {productIds.length} sản phẩm được chọn
                  </Badge>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[300px]">
            {applyToAllProducts ? (
              "Khuyến mãi được áp dụng cho tất cả sản phẩm"
            ) : (
              <div>
                <p className="font-medium mb-1">
                  Chỉ áp dụng cho {productIds.length} sản phẩm được chọn
                </p>
                {productIds.length > 0 && (
                  <div className="max-h-[100px] overflow-y-auto text-xs">
                    {productIds.slice(0, 5).map((id, index) => (
                      <div key={index} className="truncate">
                        {id}
                      </div>
                    ))}
                    {productIds.length > 5 && (
                      <div className="text-muted-foreground mt-1">
                        + {productIds.length - 5} sản phẩm khác
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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

export default availableWithProductColumn;
