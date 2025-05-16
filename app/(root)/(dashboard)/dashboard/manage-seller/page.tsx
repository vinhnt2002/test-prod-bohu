"use client";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { SearchParams } from "@/types/table";
import React from "react";
import { getStores } from "@/features/manage-seller/actions/manage-seller-action";
import { SellerTable } from "@/features/manage-seller/components/seller-table";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const ManageSellerPage = ({ searchParams }: IndexPageProps) => {
  const storePromise = getStores(searchParams);

  return (
    <div className="min-w-full">
      <Shell>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý người bán
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách cửa hàng và người bán trên hệ thống
          </p>
        </div>

        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              searchableColumnCount={2}
              filterableColumnCount={1}
              cellWidths={[
                "50px",
                "60px",
                "80px",
                "200px",
                "100px",
                "200px",
                "200px",
              ]}
              shrinkZero
            />
          }
        >
          <SellerTable storePromise={storePromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default ManageSellerPage;
