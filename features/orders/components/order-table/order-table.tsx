"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  Option,
} from "@/types/table";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";

import { getOrders } from "../../actions/order-action";
import { fetchOrderTableColumnDefs } from "./order-table-column-def";

interface OrderTableProps {
  orderPromise: ReturnType<typeof getOrders>;
}

// Order status options
const orderStatusOptions: Option[] = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

// Payment status options
const paymentStatusOptions: Option[] = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export function OrdersTable({ orderPromise }: OrderTableProps) {
  const { data, pageCount } = React.use(orderPromise);

  const columns = React.useMemo<ColumnDef<IOrder, unknown>[]>(
    () => fetchOrderTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  const searchableColumns: DataTableSearchableColumn<IOrder>[] = [
    {
      id: "_id",
      title: "Mã đơn hàng",
    },
    {
      id: "customer",
      title: "Tên khách hàng",
    },
    {
      id: "customer",
      title: "Email khách hàng",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<IOrder>[] = [
    {
      id: "order_status",
      title: "Trạng thái đơn hàng",
      options: orderStatusOptions,
    },
    {
      id: "payment_status",
      title: "Trạng thái thanh toán",
      options: paymentStatusOptions,
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
    <div className="h-full flex flex-col overflow-hidden">
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
