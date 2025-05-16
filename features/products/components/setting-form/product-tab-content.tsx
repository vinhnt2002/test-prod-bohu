import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import PricingSideCard from "./pricing-side-card";

interface ProductTabContentProps {
  productType: string;
  pricingData: Record<
    string,
    { one_side: Record<string, number>; two_side: Record<string, number> }
  >;
  pricingTypes: string[];
  handleEditPrice: (
    productType: string,
    side: "one_side" | "two_side",
    size: string,
    price: number
  ) => void;
  handleAddSize: (productType: string, side: "one_side" | "two_side") => void;
  confirmDeleteType: (productType: string) => void;
  onAddSize: (open: boolean) => void;
}

const ProductTabContent = ({
  productType,
  pricingData,
  pricingTypes,
  handleEditPrice,
  handleAddSize,
  onAddSize,
  confirmDeleteType,
}: ProductTabContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 space-y-5"
      key={`motion-${productType}-${JSON.stringify(pricingData[productType])}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{productType}</h3>
            {pricingTypes[0] === productType && (
              <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30 text-xs">
                Phổ biến
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {Object.keys(pricingData[productType].one_side).length +
              Object.keys(pricingData[productType].two_side).length}{" "}
            kích thước với 2 loại in (1 mặt/2 mặt)
          </p>
        </div>

        <div className="flex gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 bg-background hover:bg-background"
                  onClick={() => handleAddSize(productType, "one_side")}
                >
                  <PlusCircle size={14} />
                  <span className="hidden sm:inline">Thêm kích cỡ</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm kích cỡ mới</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>
                <Link
                  className="cursor-pointer flex items-center gap-2"
                  href={`/dashboard/products/settings/bulk-edit/${productType}/one`}
                >
                  <Pencil size={14} />
                  <span>Chỉnh sửa hàng loạt (1 mặt)</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="cursor-pointer flex items-center gap-2"
                  href={`/dashboard/products/settings/bulk-edit/${productType}/two`}
                >
                  <Pencil size={14} />
                  <span>Chỉnh sửa hàng loạt (2 mặt)</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => confirmDeleteType(productType)}
                className="cursor-pointer flex items-center gap-2 text-destructive"
              >
                <Trash size={14} />
                <span>Xóa loại sản phẩm</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Responsive grid layout for pricing tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* One-side pricing */}
        <PricingSideCard
          key={`one-side-${productType}-${JSON.stringify(
            pricingData[productType].one_side
          )}`}
          productType={productType}
          side="one_side"
          sideData={pricingData[productType].one_side}
          handleEditPrice={handleEditPrice}
          handleAddSize={handleAddSize}
          onAddSize={onAddSize}
        />

        {/* Two-side pricing */}
        <PricingSideCard
          key={`two-side-${productType}-${JSON.stringify(
            pricingData[productType].two_side
          )}`}
          productType={productType}
          side="two_side"
          sideData={pricingData[productType].two_side}
          handleEditPrice={handleEditPrice}
          handleAddSize={handleAddSize}
          onAddSize={onAddSize}
        />
      </div>
    </motion.div>
  );
};

export default ProductTabContent;
