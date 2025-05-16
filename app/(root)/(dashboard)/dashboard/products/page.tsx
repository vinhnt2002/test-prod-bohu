"use client";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/products/actions/product-action";
import { ProductsTable } from "@/features/products/components/product-table/product-table";
import { SearchParams } from "@/types/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const ProductPage = ({ searchParams }: IndexPageProps) => {
  const productPromise = getProducts(searchParams);
  return (
    <div className="min-w-full">
      <Shell>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sản phẩm</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách sản phẩm của cửa hàng
            </p>
          </div>
          <Button asChild>
            <Link
              href="/dashboard/products/create"
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo sản phẩm mới
            </Link>
          </Button>
        </div>
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
          <ProductsTable productPromise={productPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default ProductPage;
