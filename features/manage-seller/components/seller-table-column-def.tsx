"use client";

import { type ColumnDef } from "@tanstack/react-table";
import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";
import nameColumn from "./column/name-column";
import logoColumn from "./column/logo-column";
import statusColumn from "./column/status-column";
import contactColumn from "./column/contact-column";
import metricsColumn from "./column/metrics-column";
import actionColumn from "./column/action-column";

export function fetchSellerTableColumnDefs(): ColumnDef<IStore, unknown>[] {
  return [
    selectColumn,
    logoColumn,
    idColumn,
    nameColumn,
    statusColumn,
    contactColumn,
    metricsColumn,
    actionColumn,
  ];
}
