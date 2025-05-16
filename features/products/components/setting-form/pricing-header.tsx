import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, Layers, PlusCircle } from "lucide-react";
import Link from "next/link";

interface PricingHeaderProps {
  pricingTypesCount: number;
  sizesCount: number;
  viewMode: "tabs" | "grid";
  setViewMode: (mode: "tabs" | "grid") => void;
  handleAddNewType: () => void;
}

const PricingHeader = ({
  pricingTypesCount,
  sizesCount,
  viewMode,
  setViewMode,
  handleAddNewType,
}: PricingHeaderProps) => {
  return (
    <CardHeader className="pb-3 bg-gradient-to-br from-muted/40 via-muted/20 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-full">
            <DollarSign size={20} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Quản lý giá sản phẩm
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Thiết lập giá theo loại và kích thước sản phẩm
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 gap-1.5 bg-primary/10 text-primary border-primary/10 hover:bg-primary/20"
              >
                <Layers size={14} />
                <span className="font-medium">{pricingTypesCount}</span>
                <span className="hidden sm:inline">loại sản phẩm</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    Thống kê giá sản phẩm
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{pricingTypesCount} loại sản phẩm</p>
                    <p>{sizesCount} kích cỡ</p>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* View Mode Switcher */}
          {pricingTypesCount > 5 && (
            <div className="flex items-center rounded-md border border-muted p-0.5">
              <Button
                variant={viewMode === "tabs" ? "default" : "ghost"}
                size="sm"
                className="h-7 rounded-sm"
                onClick={() => setViewMode("tabs")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1.5"
                >
                  <path
                    d="M2 3C2 2.44772 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V3ZM3 3V12H12V3H3Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Chi tiết
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-7 rounded-sm"
                onClick={() => setViewMode("grid")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1.5"
                >
                  <path
                    d="M2.5 4.5C2.5 3.09886 3.59886 2 5 2H10C11.4011 2 12.5 3.09886 12.5 4.5V10.5C12.5 11.9011 11.4011 13 10 13H5C3.59886 13 2.5 11.9011 2.5 10.5V4.5ZM5 3H10C10.8487 3 11.5 3.65127 11.5 4.5V10.5C11.5 11.3487 10.8487 12 10 12H5C4.15127 12 3.5 11.3487 3.5 10.5V4.5C3.5 3.65127 4.15127 3 5 3Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                  <path
                    d="M6.5 5C6.22386 5 6 5.22386 6 5.5V9.5C6 9.77614 6.22386 10 6.5 10H8.5C8.77614 10 9 9.77614 9 9.5V5.5C9 5.22386 8.77614 5 8.5 5H6.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Lưới
              </Button>
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/products/settings/add-type">
                  <Button variant="default" size="sm" className="h-8">
                    <PlusCircle size={14} className="mr-1.5" />
                    Thêm loại
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm loại sản phẩm mới</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </CardHeader>
  );
};

export default PricingHeader;
