import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface PricingFooterProps {
  pricingTypes: string[];
  pricingData: Record<
    string,
    { one_side: Record<string, number>; two_side: Record<string, number> }
  >;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setShowSearchInput: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  handleAddNewType: () => void;
}

const PricingFooter = ({
  pricingTypes,
  pricingData,
  searchQuery,
  setSearchQuery,
  setShowSearchInput,
  setActiveTab,
  handleAddNewType,
}: PricingFooterProps) => {
  // Calculate total sizes
  const totalSizes = pricingTypes.reduce((total, type) => {
    return (
      total +
      Object.keys(pricingData[type].one_side).length +
      Object.keys(pricingData[type].two_side).length
    );
  }, 0);

  return (
    <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 bg-muted/5 border-t border-border/50 gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Tổng quan</p>
        <p className="text-xs text-muted-foreground">
          {pricingTypes.length} loại sản phẩm, {totalSizes} kích cỡ
        </p>

        {pricingTypes.length > 10 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {pricingTypes.slice(0, 5).map((type) => (
              <Badge
                key={`footer-${type}`}
                variant="outline"
                className="bg-background cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setActiveTab(type)}
              >
                {type}
              </Badge>
            ))}
            {pricingTypes.length > 5 && (
              <Badge variant="outline" className="bg-background">
                +{pricingTypes.length - 5} loại
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 ml-auto">
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => {
              setSearchQuery("");
              setShowSearchInput(false);
            }}
          >
            <X size={14} className="mr-1.5" />
            Xóa tìm kiếm
          </Button>
        )}

        <Button
          className="flex items-center gap-2"
          size="sm"
          onClick={handleAddNewType}
        >
          <PlusCircle size={14} />
          Thêm loại sản phẩm
        </Button>
      </div>
    </CardFooter>
  );
};

export default PricingFooter;
