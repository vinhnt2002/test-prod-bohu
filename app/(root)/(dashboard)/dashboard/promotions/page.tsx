"use client";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { Shell } from "@/components/shared/custom-ui/shell";
import { SearchParams } from "@/types/table";
import React from "react";
import { getPromotions } from "@/features/promotions/actions/promotion-action";
import { PromotionsTable } from "@/features/promotions/components/promotion-table/promotion-table";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const PromotionPage = ({ searchParams }: IndexPageProps) => {
  const promotionPromise = getPromotions(searchParams);
  return (
    <div className="min-w-full">
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
          <PromotionsTable promotionPromise={promotionPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default PromotionPage;
