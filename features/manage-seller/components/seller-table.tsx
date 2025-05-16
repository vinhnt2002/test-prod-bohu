"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { getStores } from "../actions/manage-seller-action";
import { fetchSellerTableColumnDefs } from "./seller-table-column-def";

interface SellerTableProps {
  storePromise: ReturnType<typeof getStores>;
}

export function SellerTable({ storePromise }: SellerTableProps) {
  const { data, pageCount } = React.use(storePromise);

  const columns = React.useMemo<ColumnDef<IStore, unknown>[]>(
    () => fetchSellerTableColumnDefs(),
    []
  );

  // Define searchable columns
  const searchableColumns: DataTableSearchableColumn<IStore>[] = [
    {
      id: "name",
      title: "Tên cửa hàng",
    },
    {
      id: "seller_id",
      title: "ID người bán",
    },
  ];

  // Define filterable columns
  const filterableColumns: DataTableFilterableColumn<IStore>[] = [
    {
      id: "status",
      title: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Chờ duyệt", value: "pending" },
        { label: "Đã khóa", value: "inactive" },
      ],
    },
  ];

  // Generate column labels for display
  const labels = {
    name: "Tên cửa hàng",
    status: "Trạng thái",
    _id: "ID",
    logo: "Logo",
    contact: "Liên hệ",
    metrics: "Thống kê",
  };

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
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
