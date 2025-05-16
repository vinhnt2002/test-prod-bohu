"use client";

import { type ColumnDef } from "@tanstack/react-table";
import selectColumn from "./column/select-column";
import nameColumn from "./column/name-column";
import codeColumn from "./column/code-column";
import discountTypeColumn from "./column/discount-type-column";
import { discountValueColumn } from "./column/discount-value-column";
import availableWithProductColumn from "./column/available-with-product-column";
import actionColumn from "./column/action-column";
export function fetchPromotionTableColumnDefs(): ColumnDef<
  IPromotion,
  unknown
>[] {
  return [
    selectColumn,
    codeColumn,
    discountTypeColumn,
    discountValueColumn,
    availableWithProductColumn,
    nameColumn,
    actionColumn,
  ];
}

export default fetchPromotionTableColumnDefs;
