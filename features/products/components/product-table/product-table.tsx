"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  Option,
} from "@/types/table";
import { toast } from "sonner";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";

import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { getProducts } from "../../actions/product-action";
import { fetchProductTableColumnDefs } from "./product-table-column-def";

interface ProductTableProps {
  productPromise: ReturnType<typeof getProducts>;
}

export function ProductsTable({ productPromise }: ProductTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);

  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { data, pageCount } = React.use(productPromise);

  const columns = React.useMemo<ColumnDef<IProduct, unknown>[]>(
    () => fetchProductTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  const searchableColumns: DataTableSearchableColumn<IProduct>[] = [
    {
      id: "name",
      title: "dịch vụ",
    },
  ];


  const CategoryTypeNames = {
    "T-shirt": "T-shirt",
    "Tank-top": "Tank-top",
    "Hoodie": "Hoodie",
    "Jacket": "Jacket",
    "Sweater": "Sweater",
  }

  const filterableColumns: DataTableFilterableColumn<IProduct>[] = [
    {
      id: "category",
      title: "Danh mục",
      options: Object.entries(CategoryTypeNames).map(([value, label]) => ({
        label,
        value,
      })),
    },
    // {
    //   id: "name",
    //   title: "Trạng thái",
    //   options: Object.entries(ServiceTypeNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // {
    //   id: "id",
    //   title: "Tiến Lọc",
    //   options: Object.entries(ServiceTypeNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // test mode
    // {
    //   id: "status",
    //   title: "Trạng thái xử lý",
    //   options: Object.entries(ProcessStatusNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // test mode
    // {
    //   id: "status",
    //   title: "Trạng thái đơn",
    //   options: Object.entries(OrderStatusMap).reduce((acc, [value, label]) => {
    //     if (typeof label === "string") {
    //       acc.push({ label, value });
    //     }
    //     return acc;
    //   }, [] as Option[]),
    // },
  ];

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="h-full flex flex-col">
      <DataTable
        dataTable={dataTable}
        // floatingBarContent={
        //   enableFloatingBar ? <TasksTableFloatingBar table={dataTable} /> : null
        // }
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
