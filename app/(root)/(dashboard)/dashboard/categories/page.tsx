import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { Shell } from "@/components/shared/custom-ui/shell";
import { SearchParams } from "@/types/table";
import React from "react";
import { ProductsTable } from "@/features/products/components/product-table/product-table";
import { getCategories } from "@/features/categories/actions/category-action";
import { CategoryTable } from "@/features/categories/components/category-table/category-table";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const CategoryPage = ({ searchParams }: IndexPageProps) => {
  // call
  const categoryPromise = getCategories(searchParams);
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
          <CategoryTable categoryPromise={categoryPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default CategoryPage;
