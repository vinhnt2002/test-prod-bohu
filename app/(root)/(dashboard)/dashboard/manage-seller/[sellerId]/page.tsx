import { Shell } from "@/components/shared/custom-ui/shell";
import {
  getStoreById,
  getProductsBySellerId,
} from "@/features/manage-seller/actions/manage-seller-action";
import { SellerDetailHeader } from "@/features/manage-seller/components/seller-detail-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { SearchParams } from "@/types/table";
import { ProductsTable } from "@/features/products/components/product-table/product-table";

interface SellerDetailPageProps {
  params: {
    sellerId: string;
  };
  searchParams: SearchParams;
}

export default async function SellerDetailPage({
  params,
  searchParams,
}: SellerDetailPageProps) {
  const { sellerId } = params;

  // Fetch seller data
  const sellerData = await getStoreById(sellerId);

  if (!sellerData.data) {
    notFound();
  }

  const seller = sellerData.data;

  // Add sellerId to searchParams for product filtering
  const productsSearchParams = {
    ...searchParams,
    sellerId: sellerId,
  };

  // Fetch products by seller ID
  const productsPromise = getProductsBySellerId(productsSearchParams);

  return (
    <div className="min-w-full">
      <Shell>
        <SellerDetailHeader seller={seller} />

        <div className="mt-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-4">
              <React.Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={6}
                    searchableColumnCount={1}
                    filterableColumnCount={1}
                    cellWidths={[
                      "50px",
                      "80px",
                      "200px",
                      "100px",
                      "100px",
                      "80px",
                    ]}
                    shrinkZero
                  />
                }
              >
                <ProductsTable productPromise={productsPromise} />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="orders" className="mt-4">
              <div className="p-8 text-center text-muted-foreground">
                Tính năng đang phát triển
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="p-8 text-center text-muted-foreground">
                Tính năng đang phát triển
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Shell>
    </div>
  );
}
