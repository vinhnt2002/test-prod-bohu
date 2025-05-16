"use client";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { SearchParams } from "@/types/table";
import React from "react";
import { getOrders } from "@/features/orders/actions/order-action";
import { OrdersTable } from "@/features/orders/components/order-table/order-table";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const OrderPage = ({ searchParams }: IndexPageProps) => {
  // call
  const orderPromise = getOrders(searchParams);
  return (
    <div className="min-w-full">
      <Shell>
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
          <OrdersTable orderPromise={orderPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default OrderPage;
