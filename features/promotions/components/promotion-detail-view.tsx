"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductsForSelection } from "@/features/products/actions/product-action";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  CalendarRange,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  PercentCircle,
  ShoppingBag,
  Tag,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PromotionDetailViewProps {
  promotion: IPromotion;
}

export function PromotionDetailView({ promotion }: PromotionDetailViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState<
    { id: string; name: string; imageUrl: string; price: number }[]
  >([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Format dates
  const startDate = parseISO(promotion.start_date);
  const endDate = parseISO(promotion.end_date);

  // Calculate status
  const now = new Date();
  const isExpired = now > endDate;
  const isActive = promotion.active && !isExpired && now >= startDate;
  const isUpcoming = now < startDate;

  // Calculate usage percentage
  const usagePercentage =
    promotion.usage_limit > 0
      ? Math.min(100, (promotion.usage_count / promotion.usage_limit) * 100)
      : 0;

  // Calculate time remaining or time until start
  const getTimeStatus = () => {
    if (isExpired) {
      return "Đã kết thúc";
    } else if (isUpcoming) {
      const daysToStart = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Còn ${daysToStart} ngày để bắt đầu`;
    } else {
      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Còn ${daysRemaining} ngày`;
    }
  };

  function getStatusBadge() {
    if (isExpired) {
      return (
        <Badge variant="destructive" className="px-3 py-1 text-sm">
          Hết hạn
        </Badge>
      );
    } else if (!promotion.active) {
      return (
        <Badge variant="outline" className="px-3 py-1 text-sm">
          Không hoạt động
        </Badge>
      );
    } else if (isUpcoming) {
      return (
        <Badge variant="secondary" className="px-3 py-1 text-sm">
          Chưa bắt đầu
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="px-3 py-1 text-sm">
          Đang hoạt động
        </Badge>
      );
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  function getDiscountDisplay() {
    if (promotion.discount_type === "percentage") {
      return `${promotion.discount_value}%`;
    } else {
      return formatCurrency(promotion.discount_value);
    }
  }

  // Tải danh sách sản phẩm khi component mount nếu không áp dụng cho tất cả sản phẩm
  useEffect(() => {
    if (!promotion.apply_to_all_products && promotion.product_ids.length > 0) {
      const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
          const productList = await getProductsForSelection();
          const formattedProducts = productList.data.map((product) => ({
            id: product.id,
            name: product.name,
            imageUrl: product.images[0] || "",
            price: product.price,
          }));
          setProducts(formattedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchProducts();
    }
  }, [promotion.apply_to_all_products, promotion.product_ids]);

  // Lọc sản phẩm được áp dụng từ danh sách sản phẩm đã tải
  const appliedProducts = products.filter((product) =>
    promotion.product_ids.includes(product.id)
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center sticky top-0 bg-background z-10 py-3 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/promotions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{promotion.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                {promotion.code}
              </code>
              <div className="ml-2">{getStatusBadge()}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            asChild
          >
            <Link href={`/dashboard/promotions/${promotion._id}/edit`}>
              <Edit className="h-4 w-4" /> Chỉnh sửa
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Thông tin khuyến mãi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Loại giảm giá</p>
                  <p className="font-medium flex items-center gap-2">
                    <PercentCircle
                      className={cn(
                        "h-5 w-5",
                        promotion.discount_type === "percentage"
                          ? "text-indigo-500"
                          : "text-emerald-500"
                      )}
                    />
                    {promotion.discount_type === "percentage"
                      ? "Phần trăm"
                      : "Giá trị cố định"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Giá trị giảm giá
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {getDiscountDisplay()}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                <p className="bg-muted/50 p-3 rounded-md">
                  {promotion.description || "Không có mô tả"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-primary" />
                Thời gian áp dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="font-medium">
                    {format(startDate, "dd/MM/yyyy")}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                  <p className="font-medium">{format(endDate, "dd/MM/yyyy")}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Trạng thái thời gian
                  </p>
                  <p
                    className={cn(
                      "font-medium flex items-center gap-2",
                      isExpired
                        ? "text-red-500"
                        : isUpcoming
                        ? "text-amber-500"
                        : "text-green-500"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    {getTimeStatus()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Sản phẩm áp dụng
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Điều kiện áp dụng
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    {promotion.apply_to_all_products ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                          Áp dụng cho tất cả sản phẩm
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="font-medium">
                          Chỉ áp dụng cho sản phẩm được chọn
                        </span>
                      </>
                    )}
                  </div>

                  {!promotion.apply_to_all_products &&
                    promotion.product_ids.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Danh sách sản phẩm</h3>
                          <Badge variant="outline">
                            {promotion.product_ids.length} sản phẩm
                          </Badge>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto bg-muted/50 p-3 rounded-md border">
                          {loadingProducts ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 rounded bg-background border"
                                >
                                  <Skeleton className="h-10 w-10 rounded-md" />
                                  <div className="space-y-1 flex-1">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <ul className="space-y-2">
                              {appliedProducts.length > 0
                                ? appliedProducts.map((product) => (
                                    <li
                                      key={product.id}
                                      className="bg-background p-2 rounded border flex items-center gap-2"
                                    >
                                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                      <div className="flex-1">
                                        <p className="font-medium">
                                          {product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                          }).format(product.price)}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() =>
                                          router.push(
                                            `/dashboard/products/${product.id}`
                                          )
                                        }
                                      >
                                        Xem
                                      </Button>
                                    </li>
                                  ))
                                : promotion.product_ids.map((id) => (
                                    <li
                                      key={id}
                                      className="font-mono text-xs bg-background p-2 rounded border flex items-center"
                                    >
                                      <ShoppingBag className="h-3 w-3 mr-2 text-muted-foreground" />
                                      {id}
                                    </li>
                                  ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="conditions" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        Giá trị đơn hàng tối thiểu
                      </span>
                    </div>
                    <p className="text-lg font-bold">
                      {formatCurrency(promotion.min_purchase_amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Tình trạng sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Số lần sử dụng
                  </p>
                  <p className="font-medium">
                    {promotion.usage_count} / {promotion.usage_limit} lần
                  </p>
                </div>
                <Progress
                  value={usagePercentage}
                  className="h-2"
                  color={usagePercentage > 75 ? "bg-red-500" : "bg-primary"}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {promotion.usage_limit > 0
                    ? `Còn lại ${
                        promotion.usage_limit - promotion.usage_count
                      } lần sử dụng`
                    : "Không giới hạn số lần sử dụng"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Trạng thái
                  </span>
                  <span>{getStatusBadge()}</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-md">
                  <span className="text-sm text-muted-foreground">
                    Mã khuyến mãi
                  </span>
                  <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                    {promotion.code}
                  </code>
                </li>
                <li className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Giảm giá
                  </span>
                  <span className="font-medium">{getDiscountDisplay()}</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-md">
                  <span className="text-sm text-muted-foreground">Bắt đầu</span>
                  <span>{format(startDate, "dd/MM/yyyy")}</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Kết thúc
                  </span>
                  <span>{format(endDate, "dd/MM/yyyy")}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push("/dashboard/promotions")}
              >
                Quay lại danh sách
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
