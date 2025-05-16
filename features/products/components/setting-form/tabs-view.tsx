import { CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import PricingTabHeader from "./pricing-tab-header";
import ProductTabContent from "./product-tab-content";

interface TabsViewProps {
  pricingTypes: string[];
  filteredProductTypes: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pricingData: Record<
    string,
    { one_side: Record<string, number>; two_side: Record<string, number> }
  >;
  handleEditPrice: (
    productType: string,
    side: "one_side" | "two_side",
    size: string,
    price: number
  ) => void;
  handleAddSize: (productType: string, side: "one_side" | "two_side") => void;
  confirmDeleteType: (productType: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
  onAddSize: (open: boolean) => void;
}

const TabsView = ({
  pricingTypes,
  filteredProductTypes,
  activeTab,
  setActiveTab,
  pricingData,
  handleEditPrice,
  handleAddSize,
  confirmDeleteType,
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
  onAddSize,
}: TabsViewProps) => {
  return (
    <>
      <PricingTabHeader
        pricingTypes={pricingTypes}
        filteredProductTypes={filteredProductTypes}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearchInput={showSearchInput}
        setShowSearchInput={setShowSearchInput}
      />

      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          {pricingTypes.map((productType) => (
            <TabsContent
              key={`${productType}-${
                Object.keys(pricingData[productType].one_side).length
              }-${Object.keys(pricingData[productType].two_side).length}`}
              value={productType}
              className="m-0 outline-none"
            >
              <ProductTabContent
                key={`product-tab-${productType}-${JSON.stringify(
                  pricingData[productType]
                )}`}
                productType={productType}
                pricingData={pricingData}
                pricingTypes={pricingTypes}
                handleEditPrice={handleEditPrice}
                handleAddSize={handleAddSize}
                confirmDeleteType={confirmDeleteType}
                onAddSize={onAddSize}
              />
            </TabsContent>
          ))}
        </AnimatePresence>
      </CardContent>
    </>
  );
};

export default TabsView;
