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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
import { Plus, Search, SlidersHorizontal, Tag } from "lucide-react";
import Link from "next/link";
import { getPromotions } from "../../actions/promotion-action";
import { fetchPromotionTableColumnDefs } from "./promotion-table-column-def";

interface PromotionTableProps {
  promotionPromise: ReturnType<typeof getPromotions>;
}

export function PromotionsTable({ promotionPromise }: PromotionTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);

  const { data, pageCount } = React.use(promotionPromise);

  const columns = React.useMemo<ColumnDef<IPromotion, unknown>[]>(
    () => fetchPromotionTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  const searchableColumns: DataTableSearchableColumn<IPromotion>[] = [
    {
      id: "name",
      title: "tên khuyến mãi",
    },
    {
      id: "code",
      title: "mã khuyến mãi",
    },
  ];

  const DiscountTypeNames = {
    fixed: "Giá trị cố định",
    percentage: "Phần trăm",
  };

  const filterableColumns: DataTableFilterableColumn<IPromotion>[] = [
    {
      id: "discount_type",
      title: "Loại giảm giá",
      options: Object.entries(DiscountTypeNames).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      id: "active",
      title: "Trạng thái",
      options: [
        { label: "Đang hoạt động", value: "true" },
        { label: "Không hoạt động", value: "false" },
      ],
    },
    {
      id: "apply_to_all_products",
      title: "Phạm vi áp dụng",
      options: [
        { label: "Tất cả sản phẩm", value: "true" },
        { label: "Sản phẩm được chọn", value: "false" },
      ],
    },
  ];

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  // Tính số lượng khuyến mãi theo trạng thái
  const activePromotions =
    data?.filter(
      (promo) =>
        promo.active &&
        new Date() >= new Date(promo.start_date) &&
        new Date() <= new Date(promo.end_date)
    ).length || 0;

  const upcomingPromotions =
    data?.filter(
      (promo) => promo.active && new Date() < new Date(promo.start_date)
    ).length || 0;

  const expiredPromotions =
    data?.filter((promo) => new Date() > new Date(promo.end_date)).length || 0;

  const inactivePromotions = data?.filter((promo) => !promo.active).length || 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            Quản lý khuyến mãi
          </h2>
          <p className="text-muted-foreground">
            Tạo và quản lý các mã khuyến mãi cho cửa hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard/promotions/create">
              <Plus className="h-4 w-4" /> Thêm khuyến mãi
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Tất cả</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {data?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Đang hoạt động</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {activePromotions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>Sắp tới</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {upcomingPromotions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span>Hết hạn</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {expiredPromotions}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Tìm kiếm</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-2"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Lọc</span>
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0 pt-6">
              <DataTable
                dataTable={dataTable}
                columns={columns}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                columnLabels={labels}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="m-0">
          <Card>
            <CardContent className="p-0 pt-6">
              <DataTable
                dataTable={dataTable}
                columns={columns}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                columnLabels={labels}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="m-0">
          <Card>
            <CardContent className="p-0 pt-6">
              <DataTable
                dataTable={dataTable}
                columns={columns}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                columnLabels={labels}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="m-0">
          <Card>
            <CardContent className="p-0 pt-6">
              <DataTable
                dataTable={dataTable}
                columns={columns}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                columnLabels={labels}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
