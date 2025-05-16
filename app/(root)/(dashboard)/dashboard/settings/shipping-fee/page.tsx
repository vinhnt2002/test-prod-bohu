import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import ShippingSection from "@/features/settings/components/shipping-fee/shipping-section";
import { SearchParams } from "@/types/table";
import React from "react";
export interface IndexPageProps {
  searchParams: SearchParams;
}
const ShippingFeePage = ({ searchParams }: IndexPageProps) => {
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
          <ShippingSection />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default ShippingFeePage;
