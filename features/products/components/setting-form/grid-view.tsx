import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import ProductTypeCard from "./product-type-card";

interface GridViewProps {
  filteredProductTypes: string[];
  pricingTypes: string[];
  pricingData: Record<
    string,
    { one_side: Record<string, number>; two_side: Record<string, number> }
  >;
  handleBulkEdit: (productType: string, side: "one_side" | "two_side") => void;
  confirmDeleteType: (productType: string) => void;
  handleAddSize: (productType: string, side: "one_side" | "two_side") => void;
  setActiveTab: (tab: string) => void;
  setViewMode: (mode: "tabs" | "grid") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
}

const GridView = ({
  filteredProductTypes,
  pricingTypes,
  pricingData,
  handleBulkEdit,
  confirmDeleteType,
  handleAddSize,
  setActiveTab,
  setViewMode,
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
}: GridViewProps) => {
  return (
    <div>
      <div className="px-4 py-2 bg-muted/10 border-y sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Loại sản phẩm{" "}
            {pricingTypes.length > 15 &&
              `(${filteredProductTypes.length}/${pricingTypes.length})`}
          </h3>
          <div className="flex items-center gap-2">
            {showSearchInput ? (
              <div className="flex items-center">
                <Input
                  placeholder="Tìm loại sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-[200px] text-sm focus-visible:ring-primary"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchInput(false);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSearchInput(true)}
              >
                <Search size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {filteredProductTypes.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p>Không tìm thấy loại sản phẩm phù hợp</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                setSearchQuery("");
                setShowSearchInput(false);
              }}
            >
              Xóa tìm kiếm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProductTypes.map((productType) => (
              <ProductTypeCard
                key={productType}
                productType={productType}
                isPopular={pricingTypes[0] === productType}
                pricingData={pricingData}
                onEdit={handleBulkEdit}
                onDelete={(type) => confirmDeleteType(type)}
                onAddSize={handleAddSize}
                onViewDetails={(type) => {
                  setActiveTab(type);
                  setViewMode("tabs");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridView;
