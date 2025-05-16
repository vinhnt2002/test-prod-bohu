import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getProducts } from "@/features/products/actions/product-action";
import PricingSection from "@/features/products/components/setting-form/setting-section";
import { SearchParams } from "@/types/table";
import React from "react";
export interface IndexPageProps {
  searchParams: SearchParams;
}
const SettingsPage = ({ searchParams }: IndexPageProps) => {
  const productPromise = getProducts(searchParams);

  return (
    <div>
      <Shell>
        {/* <FeatureFlagsToggle /> */}
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/* <SettingForm productPromise={productPromise}/> */}
          <PricingSection />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default SettingsPage;
