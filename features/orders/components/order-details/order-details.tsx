import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import {
  ChevronLeft,
  Printer,
  Package,
  User,
  CreditCard,
  Truck,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrderDetailsViewProps {
  order: IOrder;
}

const getPaymentStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "refunded":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

const getOrderStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const formattedDate = format(
    new Date(order.created_at * 1000),
    "dd/MM/yyyy HH:mm",
    {
      locale: enGB,
    }
  );

  const formattedUpdateDate = format(
    new Date(order.updated_at * 1000),
    "dd/MM/yyyy HH:mm",
    { locale: enGB }
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header with Back Button and Badges */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="h-9">
            <Link href="/dashboard/orders">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mã đơn hàng: {order._id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap md:justify-end">
          <Badge
            className={cn(
              "px-3 py-1.5 text-sm font-medium flex items-center gap-2 capitalize",
              getOrderStatusBadgeStyles(order.order_status)
            )}
          >
            <Package className="h-3.5 w-3.5 mr-1.5" />
            {order.order_status}
          </Badge>
          <Badge
            className={cn(
              "px-3 py-1.5 text-sm font-medium flex items-center gap-2 capitalize",
              getPaymentStatusBadgeStyles(order.payment_status)
            )}
          >
            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
            {order.payment_status}
          </Badge>
          <div className="flex mt-2 md:mt-0 ml-auto md:ml-0 gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Cập nhật
            </Button>
            <Button size="sm" disabled>
              <Printer className="h-4 w-4 mr-2" />
              In đơn hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Order and Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tổng quan đơn hàng</CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Thông tin vận chuyển
                    </h3>
                    <div className="bg-muted/50 p-3 rounded-md space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phương thức:
                        </span>
                        <span className="font-medium">
                          {order.shipping_method}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phí vận chuyển:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(order.shipping_fee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Thông tin thanh toán
                    </h3>
                    <div className="bg-muted/50 p-3 rounded-md space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phương thức:
                        </span>
                        <span className="font-medium">
                          {order.payment_method}
                        </span>
                      </div>
                      {order.paypal_order_id && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Mã PayPal:
                          </span>
                          <span className="font-medium">
                            {order.paypal_order_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Chi phí</h3>
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển:
                      </span>
                      <span>{formatCurrency(order.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí xử lý:</span>
                      <span>{formatCurrency(order.handling_fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Thuế:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Sản phẩm đặt hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    {/* Product Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Total Price for Item */}
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Info and Timeline */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Tên khách hàng
                  </h3>
                  <p className="font-medium">{order.customer.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </h3>
                  <p className="break-all">{order.customer.email}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Địa chỉ giao hàng
                  </h3>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p>{order.customer.address}</p>
                    <p>
                      {order.customer.city}, {order.customer.state}{" "}
                      {order.customer.zipCode}
                    </p>
                    <p>{order.customer.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="pl-6 pb-6 border-l-2 border-muted">
                  <div>
                    <p className="font-medium">Đơn hàng được tạo</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-0">
                    <div className="h-3 w-3 rounded-full bg-primary/70"></div>
                  </div>
                  <div>
                    <p className="font-medium">Cập nhật gần nhất</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedUpdateDate}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
