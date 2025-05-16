"use client";

import { type ColumnDef } from "@tanstack/react-table";
import selectColumn from "./column/select-column";
import nameColumn from "./column/name-column";
import idColumn from "./column/id-column";
import categoryColumn from "./column/catecogy-column";
import sideColumn from "./column/side-column";
import priceColumn from "./column/price-column";
import actionColumn from "./column/action-column";
import { imageColumn } from "./column/image-column";
export function fetchProductTableColumnDefs(): ColumnDef<IProduct, unknown>[] {
  return [
    selectColumn,
    idColumn,
    imageColumn,
    nameColumn,
    priceColumn,
    categoryColumn,
    sideColumn,
    actionColumn,
  ];
}
