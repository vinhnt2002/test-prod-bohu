"use client";

import { type ColumnDef } from "@tanstack/react-table";

import idColumn from "./column/id-column";
import selectColumn from "./column/select-column";
import nameColumn from "./column/name-column";
import typeColumn from "./column/type-column";
import actionColumn from "./column/action-column";
import statusColumn from "./column/status-column";
import productCountColumn from "./column/product-count-column";
import { cn } from "@/lib/utils";

export function fetchCategoryTableColumnDefs(): ColumnDef<
  ICategory,
  unknown
>[] {
  return [
    // selectColumn,
    idColumn,
    nameColumn,
    typeColumn,
    productCountColumn,
    statusColumn,
    actionColumn,
  ];
}
