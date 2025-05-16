import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  MoreHorizontal,
  PlusCircle,
  Trash,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { PricingDataType } from "../../services/pricing-service";

interface ProductTypeCardProps {
  productType: string;
  isPopular: boolean;
  pricingData: PricingDataType;
  onEdit: (productType: string, side: "one_side" | "two_side") => void;
  onDelete: (productType: string) => void;
  onAddSize: (productType: string, side: "one_side" | "two_side") => void;
  onViewDetails: (productType: string) => void;
}

const ProductTypeCard: React.FC<ProductTypeCardProps> = ({
  productType,
  isPopular,
  pricingData,
  onEdit,
  onDelete,
  onAddSize,
  onViewDetails,
}) => {
  const oneSideCount = Object.keys(pricingData[productType].one_side).length;
  const twoSideCount = Object.keys(pricingData[productType].two_side).length;
  const totalSizes = oneSideCount + twoSideCount;

  // Get price ranges
  const oneSidePrices = Object.values(pricingData[productType].one_side);
  const twoSidePrices = Object.values(pricingData[productType].two_side);

  const minOneSidePrice =
    oneSidePrices.length > 0 ? Math.min(...oneSidePrices) : 0;
  const maxOneSidePrice =
    oneSidePrices.length > 0 ? Math.max(...oneSidePrices) : 0;
  const minTwoSidePrice =
    twoSidePrices.length > 0 ? Math.min(...twoSidePrices) : 0;
  const maxTwoSidePrice =
    twoSidePrices.length > 0 ? Math.max(...twoSidePrices) : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getPriceRange = (min: number, max: number) => {
    if (min === max) return formatCurrency(min);
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  return (
    <Card
      className="overflow-hidden hover:border-primary/30 transition-colors cursor-pointer group"
      onClick={() => onViewDetails(productType)}
    >
      <CardHeader className="p-3 bg-muted/10 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{productType}</h3>
          {isPopular && (
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-600 border-yellow-300 text-[10px] h-4 px-1.5"
            >
              Phổ biến
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onAddSize(productType, "one_side");
              }}
            >
              <PlusCircle size={14} className="mr-2" />
              Thêm kích cỡ mới
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/products/settings/bulk-edit/${productType}/one`}
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer flex items-center gap-2"
              >
                <Pencil size={14} />
                <span>Chỉnh sửa hàng loạt (1 mặt)</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/products/settings/bulk-edit/${productType}/two`}
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer flex items-center gap-2"
              >
                <Pencil size={14} />
                <span>Chỉnh sửa hàng loạt (2 mặt)</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(productType);
              }}
            >
              <Trash size={14} className="mr-2" />
              Xóa loại sản phẩm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground mb-2">
          {totalSizes} kích thước
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-muted/10 rounded-md p-2">
            <div className="flex justify-between items-center mb-1">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 h-4"
              >
                Một mặt
              </Badge>
              <span className="text-xs text-muted-foreground">
                {oneSideCount}
              </span>
            </div>
            <div className="text-xs font-mono">
              {oneSideCount > 0
                ? getPriceRange(minOneSidePrice, maxOneSidePrice)
                : "N/A"}
            </div>
          </div>

          <div className="bg-muted/10 rounded-md p-2">
            <div className="flex justify-between items-center mb-1">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 h-4"
              >
                Hai mặt
              </Badge>
              <span className="text-xs text-muted-foreground">
                {twoSideCount}
              </span>
            </div>
            <div className="text-xs font-mono">
              {twoSideCount > 0
                ? getPriceRange(minTwoSidePrice, maxTwoSidePrice)
                : "N/A"}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-xs justify-between text-primary px-2 mt-1"
        >
          <span>Xem chi tiết</span>
          <ChevronRight size={12} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductTypeCard;
