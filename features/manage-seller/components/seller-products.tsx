"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import {
  DataTableSearchableColumn,
  DataTableFilterableColumn,
} from "@/types/table";
import { getProductsBySellerId } from "../actions/manage-seller-action";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { fetchProductTableColumnDefs } from "@/features/products/components/product-table/product-table-column-def";

interface SellerProductsProps {
  productsPromise: ReturnType<typeof getProductsBySellerId>;
}

export function SellerProducts({ productsPromise }: SellerProductsProps) {
  const { data, pageCount } = React.use(productsPromise);
  const columns = React.useMemo(() => fetchProductTableColumnDefs(), []);

  // Define searchable columns
  const searchableColumns: DataTableSearchableColumn<IProduct>[] = [
    {
      id: "name",
      title: "Tên sản phẩm",
    },
    {
      id: "pre_build_product_id",
      title: "Mã sản phẩm",
    },
  ];

  // Define filterable columns
  const filterableColumns: DataTableFilterableColumn<IProduct>[] = [
    {
      id: "category",
      title: "Danh mục",
      options: [
        { label: "Áo thun", value: "tshirt" },
        { label: "Áo hoodie", value: "hoodie" },
        { label: "Ly, cốc", value: "mug" },
        { label: "Khác", value: "other" },
      ],
    },
  ];

  // Generate column labels
  const labels = {
    name: "Tên sản phẩm",
    pre_build_product_id: "Mã sản phẩm",
    image: "Hình ảnh",
    price: "Giá",
    category: "Danh mục",
    side: "Mặt",
  };

  const { dataTable } = useDataTable<IProduct, unknown>({
    data,
    columns: columns as ColumnDef<IProduct, unknown>[],
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sản phẩm của cửa hàng</h2>
        <Button size="sm" asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      <DataTable
        dataTable={dataTable}
        columns={columns as ColumnDef<IProduct, unknown>[]}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
