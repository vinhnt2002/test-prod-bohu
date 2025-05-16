"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";

import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { Button } from "@/components/ui/button";
import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getCategories } from "../../actions/category-action";
import { fetchCategoryTableColumnDefs } from "./category-table-column-def";

interface CategoryTableProps {
  categoryPromise: ReturnType<typeof getCategories>;
}

export function CategoryTable({ categoryPromise }: CategoryTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { data, pageCount } = React.use(categoryPromise);

  const columns = React.useMemo<ColumnDef<ICategory, unknown>[]>(
    () => fetchCategoryTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  const searchableColumns: DataTableSearchableColumn<ICategory>[] = [
    {
      id: "name",
      title: "Tên danh mục",
    },
    {
      id: "type",
      title: "Thể loại",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<ICategory>[] = [
    {
      id: "active",
      title: "Trạng thái",
      options: [
        { label: "Đang hoạt động", value: "true" },
        { label: "Không hoạt động", value: "false" },
      ],
    },

    {
      id: "type",
      title: "Thể loại",
      options: Array.from(
        // Lấy danh sách thể loại duy nhất từ dữ liệu
        new Set(data.map((category) => category.type))
      )
        .filter(Boolean)
        .map((type) => ({
          label: type as string,
          value: type as string,
        })),
    },
  ];

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Danh mục sản phẩm
          </h2>
          <p className="text-muted-foreground">
            Quản lý các danh mục sản phẩm trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/dashboard/categories/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo danh mục</span>
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        dataTable={dataTable}
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
