"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "./column/select-column";
import { idColumn } from "./column/id-column";
import { customerColumn } from "./column/customer-column";
import { createdAtColumn } from "./column/created-at-column";
import { actionColumn } from "./column/action-column";
import { paymentStatusColumn } from "./column/payment-status-column";
import { orderStatusColumn } from "./column/order-status-column";
import { totalColumn } from "./column/total-column";

export function fetchOrderTableColumnDefs(): ColumnDef<IOrder, unknown>[] {
  return [
    // selectColumn,
    // idColumn,
    customerColumn,
    paymentStatusColumn,
    orderStatusColumn,
    totalColumn,
    createdAtColumn,
    actionColumn,
  ];
}
