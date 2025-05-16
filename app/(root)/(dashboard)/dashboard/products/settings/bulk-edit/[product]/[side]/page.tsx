"use client";

import { Shell } from "@/components/shared/custom-ui/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SizePricePair, usePricingLogic } from "@/hooks/use-pricing-logic";
import {
  AlertCircle,
  ArrowLeft,
  DollarSign,
  PlusCircle,
  RulerIcon,
  Save,
  Tag,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface BulkEditPageProps {
  params: {
    product: string;
    side: string;
  };
}

export default function BulkEditPage({ params }: BulkEditPageProps) {
  const router = useRouter();
  const productType = decodeURIComponent(params.product);
  const side = params.side === "one" ? "one_side" : "two_side";

  const {
    pricingData,
    handleBulkEditChange,
    handleAddBulkEditRow,
    handleRemoveBulkEditRow,
    handleSaveBulkEdit,
    isLoading,
    bulkEditData,
    setBulkEditData,
  } = usePricingLogic();

  useEffect(() => {
    if (pricingData && productType && pricingData[productType]) {
      const initialData: SizePricePair[] = Object.entries(
        pricingData[productType][side]
      ).map(([size, price]) => ({
        size,
        price: price.toString(),
      }));
      setBulkEditData(initialData);
    }
  }, [pricingData, productType, side, setBulkEditData]);

  // Validate data
  const isValidData = bulkEditData.every(
    (item) => item.size.trim().length > 0 && Number(item.price) >= 0
  );

  const hasData = bulkEditData.length > 0;
  const canSave = isValidData && hasData;

  const handleSave = async () => {
    try {
      await handleSaveBulkEdit(productType, side as "one_side" | "two_side");
      router.push("/dashboard/products/settings");
    } catch (error) {
      console.error("Error saving bulk edit:", error);
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin animation-delay-300"></div>
              <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin animation-delay-700"></div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products">
                Sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products/settings">
                Cài đặt
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>Chỉnh sửa hàng loạt</BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Chỉnh sửa hàng loạt
              </h1>
              <p className="text-muted-foreground">
                Quản lý toàn bộ danh sách kích cỡ và giá cho {productType} -{" "}
                {side === "one_side" ? "in một mặt" : "in hai mặt"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/products/settings")}
                className="gap-1"
              >
                <ArrowLeft size={16} />
                Quay lại
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="gap-1"
              >
                <Save size={16} />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa danh sách kích cỡ và giá</CardTitle>
            <CardDescription>
              Cập nhật, thêm hoặc xóa kích cỡ và giá cho loại sản phẩm này
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Loại sản phẩm</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm mt-1.5 items-center gap-2">
                  <Tag size={14} className="text-muted-foreground" />
                  {productType}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Mặt in</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm mt-1.5">
                  <Badge
                    variant={side === "one_side" ? "default" : "secondary"}
                    className="px-2 py-0 text-xs mr-2"
                  >
                    {side === "one_side" ? "1 mặt" : "2 mặt"}
                  </Badge>
                  {side === "one_side" ? "In một mặt" : "In hai mặt"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Danh sách kích cỡ và giá
              </Label>
              <Badge variant="outline" className="bg-muted/30">
                {bulkEditData.length} kích cỡ
              </Badge>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pe-2">
              {bulkEditData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        value={item.size}
                        onChange={(e) =>
                          handleBulkEditChange(index, "size", e.target.value)
                        }
                        placeholder="Kích cỡ"
                        className="pl-9"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <RulerIcon
                          size={14}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>
                    {!item.size.trim() && (
                      <p className="text-xs text-destructive mt-1">
                        Vui lòng nhập kích cỡ
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleBulkEditChange(index, "price", e.target.value)
                        }
                        placeholder="Giá"
                        className="pl-9"
                        min="0"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign
                          size={14}
                          className="text-muted-foreground"
                        />
                      </div>
                    </div>
                    {(isNaN(Number(item.price)) || Number(item.price) < 0) && (
                      <p className="text-xs text-destructive mt-1">
                        Giá không hợp lệ
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    onClick={() => handleRemoveBulkEditRow(index)}
                  >
                    <Trash size={15} />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleAddBulkEditRow}
            >
              <PlusCircle size={14} className="mr-2" />
              Thêm kích cỡ mới
            </Button>

            {!canSave && bulkEditData.length > 0 && (
              <Alert
                variant={!hasData ? "destructive" : "default"}
                className="mt-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {!hasData
                    ? "Phải có ít nhất một kích cỡ được định nghĩa"
                    : "Đảm bảo tất cả kích cỡ có tên và giá hợp lệ"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/products/settings")}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!canSave} className="gap-1.5">
            <Save size={16} />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </Shell>
  );
}
